import re
from functools import lru_cache
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent.parent / "data"

# modda line: "1-modda." OR "1-modda. Title text"
_MODDA_RE = re.compile(r"^(\d+)-modda\.\s*(.*)", re.IGNORECASE)

# bob: Roman (I-bob, II bob) OR Arabic (1-BOB., 1-bob. Title)
# \b prevents matching "1-bobning" etc.
_BOB_RE = re.compile(
    r"^(?:[IVXLCDMivxlcdm]+[-–]?\s*(?:bob|BOB)\b"  # Roman: I-bob, I bob, II-BOB
    r"|\d+[-–](?:bob|BOB)\b)",                        # Arabic: 1-bob, 1-BOB
    re.IGNORECASE,
)

_BOLIM_RE = re.compile(r".+(BOʻLIM|BO['']LIM|QISM|bo['']lim).+", re.IGNORECASE)

# Noise lines to skip (edit references, change notes)
_NOISE_RE = re.compile(
    r"^(Oldingi tahrirga qarang\.|"
    r"\(.*-modda.*tahrir.*\)|"
    r"\(.*Qonun.*tahrir.*\)|"
    r"\(.*sonli.*\)|"
    r"Qonunchilik ma['']lumotlari.*)",
    re.IGNORECASE,
)

DOC_NAMES: dict[str, str] = {
    "moddalar": "O'zbekiston Respublikasi Konstitutsiyasi",
    "jinoyat_kodeksi": "Jinoyat kodeksi",
    "mehnat_kodeksi": "Mehnat kodeksi",
    "fuqarolik_kodeksi": "Fuqarolik kodeksi",
    "mamuriy_javobgarlik_kodeksi": "Ma'muriy javobgarlik to'g'risidagi kodeks",
}


def _doc_name(filepath: str) -> str:
    stem = Path(filepath).stem
    return DOC_NAMES.get(stem, stem)


def parse_document(filepath: str) -> list[dict]:
    doc_name = _doc_name(filepath)
    with open(filepath, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f.readlines()]

    articles: list[dict] = []
    current_bolim: str | None = None
    current_bob: str | None = None
    current_modda_num: str | None = None
    current_text: list[str] = []
    pending_bob: str | None = None  # bob number line waiting for title on next line

    def flush() -> None:
        if current_modda_num and current_text:
            text = " ".join(current_text).strip()
            if len(text) > 10:
                articles.append(
                    {
                        "id": f"{Path(filepath).stem}-modda-{current_modda_num}",
                        "modda": current_modda_num,
                        "text": text,
                        "bob": current_bob,
                        "bolim": current_bolim,
                        "document": doc_name,
                    }
                )

    for line in lines:
        if not line:
            continue
        if _NOISE_RE.match(line):
            continue

        if _BOLIM_RE.search(line):
            if pending_bob:
                flush()
                current_bob = pending_bob
                pending_bob = None
                current_modda_num = None
                current_text = []
            flush()
            current_bolim = line
            current_modda_num = None
            current_text = []
            continue

        bob_m = _BOB_RE.match(line)
        if bob_m:
            # Resolve any previous pending bob first
            if pending_bob:
                flush()
                current_bob = pending_bob
                pending_bob = None
                current_modda_num = None
                current_text = []

            # Check if title is already on same line (e.g. "1-bob. Asosiy qoidalar")
            after_bob = line[bob_m.end():].strip().lstrip('.').strip()
            if after_bob:
                # Full bob header on one line
                flush()
                current_bob = line
                current_modda_num = None
                current_text = []
            else:
                # Bob number only — title expected on next line
                pending_bob = line
            continue

        # If we have a pending bob, this line is its title
        if pending_bob is not None:
            flush()
            current_bob = pending_bob + " " + line
            pending_bob = None
            current_modda_num = None
            current_text = []
            continue

        modda_m = _MODDA_RE.match(line)
        if modda_m:
            flush()
            current_modda_num = modda_m.group(1)
            inline_title = modda_m.group(2).strip()
            current_text = [inline_title] if inline_title else []
            continue

        if current_modda_num is not None:
            current_text.append(line)

    flush()
    return articles


@lru_cache(maxsize=1)
def get_all_articles() -> tuple[dict, ...]:
    all_articles: list[dict] = []
    for txt_file in sorted(DATA_DIR.glob("*.txt")):
        all_articles.extend(parse_document(str(txt_file)))
    return tuple(all_articles)


def ingest(reset: bool = False) -> int:
    articles = get_all_articles()
    return len(articles)
