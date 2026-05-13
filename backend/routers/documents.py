from functools import lru_cache
from fastapi import APIRouter

from ..schemas import DocumentsResponse, LegalDocument, Bob, Modda
from ..rag.ingest import get_all_articles, DOC_NAMES

router = APIRouter(prefix="/api", tags=["documents"])

_DOC_ORDER = list(DOC_NAMES.values())


@lru_cache(maxsize=1)
def _build_response() -> DocumentsResponse:
    articles = get_all_articles()

    docs_map: dict[str, dict[str, dict]] = {}
    docs_bob_order: dict[str, list[str]] = {}

    for art in articles:
        doc_name = art["document"]
        bob_name = art["bob"] or "Umumiy"

        if doc_name not in docs_map:
            docs_map[doc_name] = {}
            docs_bob_order[doc_name] = []

        if bob_name not in docs_map[doc_name]:
            docs_map[doc_name][bob_name] = {
                "name": bob_name,
                "bolim": art["bolim"] or "",
                "moddalar": [],
            }
            docs_bob_order[doc_name].append(bob_name)

        docs_map[doc_name][bob_name]["moddalar"].append(
            Modda(
                id=art["id"],
                number=art["modda"],
                text=art["text"],
                bob=art["bob"],
                bolim=art["bolim"],
            )
        )

    ordered_names = [n for n in _DOC_ORDER if n in docs_map]
    for n in docs_map:
        if n not in ordered_names:
            ordered_names.append(n)

    legal_docs = []
    for doc_name in ordered_names:
        bobs = [
            Bob(
                name=b["name"],
                bolim=b["bolim"] or None,
                moddalar=b["moddalar"],
            )
            for bob_key in docs_bob_order[doc_name]
            for b in [docs_map[doc_name][bob_key]]
        ]
        legal_docs.append(LegalDocument(name=doc_name, bobs=bobs))

    return DocumentsResponse(documents=legal_docs)


@router.get("/documents", response_model=DocumentsResponse)
def get_documents():
    return _build_response()
