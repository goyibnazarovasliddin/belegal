import json
import os
import re
from functools import lru_cache

from rank_bm25 import BM25Okapi

from .ingest import get_all_articles

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

_SYSTEM = """Siz O'zbekiston Respublikasi qonunchiligiga ixtisoslashgan yuqori malakali huquqiy maslahatchi yordamchisiz.

Siz quyidagi huquqiy hujjatlardan foydalanasiz:
- O'zbekiston Respublikasi Konstitutsiyasi
- Jinoyat kodeksi
- Mehnat kodeksi
- Fuqarolik kodeksi
- Ma'muriy javobgarlik to'g'risidagi kodeks

QOIDALAR:
1. Faqat quyida berilgan huquqiy matnlar asosida javob bering. O'z bilimingizdan HECH QACHON foydalanmang.
2. Javobingiz to'liq, batafsil va tushuntirish xarakterida bo'lsin.
3. Har bir fikrni tegishli modda raqami va hujjat nomi bilan asoslang.
4. Javobni quyidagi tuzilmada bering:

   ## Asosiy javob
   Savolga to'g'ridan-to'g'ri, aniq javob.

   ## Huquqiy asoslar
   Har bir tegishli modda uchun:
   - **[Hujjat nomi] N-modda**: [Moddaning to'liq matni yoki asosiy qismi]
   - Ushbu modda qanday qo'llanilishi haqida tushuntirish.

   ## Xulosa
   Amaliy xulosalar va fuqaro nima qilishi mumkinligi haqida qisqacha.

5. Agar savol mavjud hujjatlardan to'liq javoblanmasa:
   "Bu savolga mavjud hujjatlardan aniq javob topilmadi. Ammo quyidagi moddalar qisman tegishli bo'lishi mumkin: ..."

Huquqiy matnlar (kontekst):
{context}"""

# Contacts per document stem
_DOC_CONTACTS: dict[str, list[dict]] = {
    "moddalar": [
        {"name": "Konstitutsiyaviy sud", "phone": "+998 71 239-10-20", "type": "phone"},
        {"name": "Adliya vazirligi", "phone": "1008", "type": "phone"},
    ],
    "jinoyat_kodeksi": [
        {"name": "Politsiya (xavfsizlik xizmati)", "phone": "102", "type": "phone"},
        {"name": "Bosh prokuratura", "phone": "191", "type": "phone"},
        {"name": "Advokatlar palatasi", "phone": "+998 71 239-04-44", "type": "phone"},
    ],
    "mehnat_kodeksi": [
        {"name": "Mehnat vazirligi", "phone": "1009", "type": "phone"},
        {"name": "Davlat mehnat inspeksiyasi", "phone": "+998 71 239-46-60", "type": "phone"},
    ],
    "fuqarolik_kodeksi": [
        {"name": "Adliya vazirligi", "phone": "1008", "type": "phone"},
        {"name": "Notariuslar palatasi", "phone": "+998 71 233-34-48", "type": "phone"},
    ],
    "mamuriy_javobgarlik_kodeksi": [
        {"name": "Ma'muriy sud", "phone": "+998 71 207-50-50", "type": "phone"},
        {"name": "Adliya vazirligi", "phone": "1008", "type": "phone"},
    ],
}

_COMMON_CONTACTS = [
    {"name": "Bepul huquqiy yordam", "phone": "109", "type": "phone"},
    {"name": "Advokatlar palatasi", "phone": "+998 71 239-04-44", "type": "phone"},
]

# Keywords → document stems for query-based contact inference
_QUERY_KEYWORDS: list[tuple[list[str], str]] = [
    (
        ["ish", "ishchi", "xodim", "maosh", "mehnat", "ish beruvchi", "ta'til",
         "ishdan bo'shatish", "ishga olish", "kasaba", "nafaqa", "ish haqi"],
        "mehnat_kodeksi",
    ),
    (
        ["jinoyat", "jazo", "hibsga", "jinoiy", "sudlanish", "o'g'irlik", "qotillik",
         "urish", "zo'ravonlik", "qamoq", "jarima", "jinoiy javobgarlik"],
        "jinoyat_kodeksi",
    ),
    (
        ["shartnoma", "mulk", "meros", "nikoh", "qarz", "zarar", "yuridik shaxs",
         "fuqarolik", "sotib olish", "ijaraga", "bitim", "mol-mulk"],
        "fuqarolik_kodeksi",
    ),
    (
        ["ma'muriy", "jarima", "soliq", "litsenziya", "ruxsat", "davlat organi",
         "ma'muriy huquqbuzarlik", "protokol"],
        "mamuriy_javobgarlik_kodeksi",
    ),
    (
        ["konstitutsiya", "huquq", "erkinlik", "fuqarolik huquqlari", "prezident",
         "parlament", "saylov", "davlat", "hokimiyat"],
        "moddalar",
    ),
]


def _infer_stems_from_query(query: str) -> list[str]:
    """Guess relevant document stems from query keywords."""
    q = query.lower()
    stems: list[str] = []
    for keywords, stem in _QUERY_KEYWORDS:
        if any(kw in q for kw in keywords):
            stems.append(stem)
    return stems


def _get_contacts(articles: list[dict], query: str = "") -> list[dict]:
    seen_names: set[str] = set()
    contacts: list[dict] = []

    # Use retrieved article stems if available, otherwise infer from query
    stems: list[str] = []
    for a in articles:
        stem = a["id"].split("-modda-")[0]
        if stem not in stems:
            stems.append(stem)

    if not stems and query:
        stems = _infer_stems_from_query(query)

    for stem in stems:
        for c in _DOC_CONTACTS.get(stem, []):
            if c["name"] not in seen_names:
                seen_names.add(c["name"])
                contacts.append(c)

    for c in _COMMON_CONTACTS:
        if c["name"] not in seen_names:
            seen_names.add(c["name"])
            contacts.append(c)

    return contacts


_NO_RESULTS_MSG = (
    "Afsuski, ushbu so'rovga tegishli moddalar mavjud hujjatlarimizda topilmadi.\n\n"
    "Ammo quyidagi imkoniyatlar orqali foydali ma'lumot olishingiz mumkin:\n\n"
    "- **Mutaxassis advokat** bilan bevosita bog'laning\n"
    "- **Bepul huquqiy yordam** markaziga murojaat qiling (📞 109)\n"
    "- **Adliya vazirligi** yoki tegishli davlat organiga murojaat qiling\n\n"
    "Savolni boshqacha so'z bilan yozib ko'ring — "
    "tizim ko'proq mos moddalarni topishi mumkin."
)


# Detect "N-modda" / "N modda" / "N-moddada" references in a query
_MODDA_Q_RE = re.compile(r"(\d+)\s*-?\s*modda", re.IGNORECASE)


def _stem(tok: str) -> str:
    """Crude prefix stemmer for agglutinative Uzbek: 'prezidenti'->'prezid'.

    Lets 'prezident', 'prezidenti', 'prezidentlikka' all collide on a shared
    prefix so BM25 matches across case suffixes.
    """
    return tok[:6] if len(tok) > 6 else tok


def _tokenize(text: str) -> list[str]:
    return re.findall(r"\w+", text.lower())


def _expand(tokens: list[str]) -> list[str]:
    """Add stemmed variants alongside raw tokens (keeps exact + fuzzy match)."""
    out: list[str] = []
    for t in tokens:
        out.append(t)
        s = _stem(t)
        if s != t:
            out.append(s)
    return out


def _index_tokens(a: dict) -> list[str]:
    """Searchable tokens for an article: text + modda number + bob + bolim + document."""
    raw = (
        _tokenize(a["text"])
        + _tokenize(str(a["modda"]))
        + _tokenize(a.get("bob") or "")
        + _tokenize(a.get("bolim") or "")
        + _tokenize(a.get("document") or "")
    )
    return _expand(raw)


@lru_cache(maxsize=1)
def _build_index() -> tuple[BM25Okapi, tuple[dict, ...]]:
    articles = get_all_articles()
    corpus = [_index_tokens(a) for a in articles]
    return BM25Okapi(corpus), articles


# ── Semantic embeddings (OpenAI) ───────────────────────────────────────────
from pathlib import Path
import hashlib

EMBED_MODEL = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")
_EMB_CACHE = Path(__file__).parent / "_embeddings.npz"


def _embed_texts(texts: list[str]):
    """Call OpenAI embeddings in batches; returns np.ndarray (n, dim)."""
    import numpy as np
    from openai import OpenAI

    client = OpenAI(api_key=OPENAI_API_KEY)
    vecs: list[list[float]] = []
    B = 256
    for i in range(0, len(texts), B):
        resp = client.embeddings.create(model=EMBED_MODEL, input=texts[i : i + B])
        vecs.extend(d.embedding for d in resp.data)
    arr = np.asarray(vecs, dtype="float32")
    arr /= (np.linalg.norm(arr, axis=1, keepdims=True) + 1e-9)  # L2-normalize
    return arr


@lru_cache(maxsize=1)
def _build_embeddings():
    """Build (or load cached) normalized article embeddings. None if no API key."""
    if not OPENAI_API_KEY:
        return None
    try:
        import numpy as np
    except ImportError:
        print("WARNING: numpy not installed; semantic search disabled.")
        return None

    articles = get_all_articles()
    sig = hashlib.md5("|".join(a["id"] for a in articles).encode()).hexdigest()

    if _EMB_CACHE.exists():
        try:
            data = np.load(_EMB_CACHE, allow_pickle=True)
            if str(data["sig"]) == sig and data["emb"].shape[0] == len(articles):
                return data["emb"]
        except Exception:
            pass

    try:
        texts = [
            f'{a["document"]} {a["modda"]}-modda {a.get("bob") or ""} {a["text"]}'
            for a in articles
        ]
        emb = _embed_texts(texts)
        np.savez(_EMB_CACHE, emb=emb, sig=sig)
        print(f"INFO: Built {emb.shape[0]} article embeddings ({EMBED_MODEL}).")
        return emb
    except Exception as e:
        print(f"WARNING: embedding build failed ({e}); semantic search disabled.")
        return None


def _rrf_fuse(bm_order: list[int], emb_order: list[int], k_const: int = 60) -> list[int]:
    """Reciprocal Rank Fusion — combine two rankings without score normalization."""
    score: dict[int, float] = {}
    for r, i in enumerate(bm_order):
        score[i] = score.get(i, 0.0) + 1.0 / (k_const + r)
    for r, i in enumerate(emb_order):
        score[i] = score.get(i, 0.0) + 1.0 / (k_const + r)
    return sorted(score, key=lambda i: score[i], reverse=True)


def search(query: str, k: int = 6) -> list[dict]:
    bm25, articles = _build_index()
    bm_scores = bm25.get_scores(_expand(_tokenize(query)))
    bm_order = sorted(range(len(bm_scores)), key=lambda i: bm_scores[i], reverse=True)

    emb = _build_embeddings()
    if emb is not None:
        try:
            import numpy as np
            qv = _embed_texts([query])[0]
            sims = emb @ qv
            emb_order = sorted(range(len(sims)), key=lambda i: sims[i], reverse=True)
            # Fuse top candidates from both signals
            fused = _rrf_fuse(bm_order[:50], emb_order[:50])
            ranked_idx = [
                i for i in fused
                if bm_scores[i] > 0 or sims[i] > 0.25
            ][:k]
        except Exception:
            ranked_idx = [i for i in bm_order[:k] if bm_scores[i] > 0]
    else:
        ranked_idx = [i for i in bm_order[:k] if bm_scores[i] > 0]

    ranked = [articles[i] for i in ranked_idx]

    # Direct "N-modda" lookups always win — prepend them, deduped
    nums = set(_MODDA_Q_RE.findall(query))
    if nums:
        direct = [a for a in articles if str(a["modda"]) in nums]
        # rank same-number matches across docs by BM25 relevance
        idx_of = {a["id"]: i for i, a in enumerate(articles)}
        direct.sort(key=lambda a: bm_scores[idx_of[a["id"]]], reverse=True)
        seen = {a["id"] for a in direct}
        merged = direct + [a for a in ranked if a["id"] not in seen]
        return merged[: max(k, len(direct))]

    return ranked


def _extract_sources(articles: list[dict]) -> list[dict]:
    return [
        {
            "id": a["id"],
            "modda": a["modda"],
            "bob": a["bob"] or "",
            "bolim": a["bolim"] or "",
            "text": a["text"][:400],
            "document": a["document"],
        }
        for a in articles
    ]


async def generate_title(query: str, answer: str = "") -> str:
    """Generate a short Uzbek chat title (3-5 words) from the first user query."""
    fallback = query.strip()
    if len(fallback) > 45:
        fallback = fallback[:42].rstrip() + "…"

    if not OPENAI_API_KEY:
        return fallback

    try:
        from langchain_openai import ChatOpenAI  # type: ignore
        from langchain_core.messages import SystemMessage, HumanMessage  # type: ignore
    except ImportError:
        return fallback

    try:
        llm = ChatOpenAI(
            model=OPENAI_MODEL,
            api_key=OPENAI_API_KEY,
            temperature=0,
            max_tokens=20,
        )
        prompt = (
            "Quyidagi savol uchun o'zbek tilida qisqa (3-5 so'z) sarlavha yarating. "
            "Faqat sarlavhani qaytaring, qo'shtirnoqsiz, nuqtasiz.\n\n"
            f"Savol: {query}"
        )
        result = await llm.ainvoke(
            [SystemMessage(content="Siz huquqiy chat uchun qisqa sarlavhalar yaratuvchisiz."),
             HumanMessage(content=prompt)]
        )
        title = (result.content or "").strip().strip('"').strip("'").strip('.')
        if not title:
            return fallback
        if len(title) > 50:
            title = title[:47].rstrip() + "…"
        return title
    except Exception:
        return fallback


def _build_search_query(query: str, history: list[dict] | None) -> str:
    """Combine recent user turns with current query for better retrieval on follow-ups."""
    if not history:
        return query
    prior_user = [m["content"] for m in history[-6:] if m["role"] == "user"]
    if not prior_user:
        return query
    return " ".join(prior_user[-2:] + [query])


async def stream_rag_response(
    query: str,
    k: int = 4,
    history: list[dict] | None = None,
):
    """Async generator yielding SSE lines. `history` is prior turns (no current query).

    Stream order: tokens first (full answer), then sources, then contacts.
    This avoids layout jumping while the bubble grows.
    """
    history = history or []

    search_q = _build_search_query(query, history)
    results = search(search_q, k)
    sources = _extract_sources(results)
    contacts = _get_contacts(results, search_q)

    if not results:
        for i in range(0, len(_NO_RESULTS_MSG), 80):
            yield f"data: {json.dumps({'type': 'token', 'content': _NO_RESULTS_MSG[i:i+80]})}\n\n"
        yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"
        yield f"data: {json.dumps({'type': 'contacts', 'contacts': contacts})}\n\n"
        yield "data: [DONE]\n\n"
        return

    llm_available = False
    if OPENAI_API_KEY:
        try:
            from langchain_openai import ChatOpenAI
            from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
            llm_available = True
        except ImportError:
            print("WARNING: langchain-openai not installed; falling back to retrieval-only mode. "
                  "Run: pip install -r backend/requirements.txt")

    if llm_available:

        context = "\n\n---\n\n".join(
            f"[{a['document']} — {a['modda']}-modda]:\n{a['text']}" for a in results
        )
        llm = ChatOpenAI(
            model=OPENAI_MODEL,
            api_key=OPENAI_API_KEY,
            temperature=0,
            streaming=True,
        )

        # Build full message list: system + truncated history + new query
        msgs = [SystemMessage(content=_SYSTEM.format(context=context))]
        for m in history[-10:]:  # last 10 turns to bound tokens
            if m["role"] == "user":
                msgs.append(HumanMessage(content=m["content"]))
            elif m["role"] == "assistant":
                msgs.append(AIMessage(content=m["content"]))
        msgs.append(HumanMessage(content=query))

        async for chunk in llm.astream(msgs):
            if chunk.content:
                yield f"data: {json.dumps({'type': 'token', 'content': chunk.content})}\n\n"
    else:
        parts = []
        for a in results:
            header = f"**{a['modda']}-modda**" + (f" — {a['bob']}" if a["bob"] else "")
            parts.append(f"{header}\n\n{a['text']}")
        answer = "\n\n---\n\n".join(parts)
        for i in range(0, len(answer), 80):
            yield f"data: {json.dumps({'type': 'token', 'content': answer[i:i+80]})}\n\n"

    # Emit sources & contacts AFTER full answer streamed → no jumping above
    yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"
    yield f"data: {json.dumps({'type': 'contacts', 'contacts': contacts})}\n\n"
    yield "data: [DONE]\n\n"
