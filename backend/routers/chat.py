from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ..schemas import ChatRequest
from ..rag.pipeline import stream_rag_response, generate_title

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat")
async def chat(request: ChatRequest):
    history = [{"role": m.role, "content": m.content} for m in (request.history or [])]
    return StreamingResponse(
        stream_rag_response(
            request.query,
            k=max(request.k or 8, 8),
            history=history,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


class TitleRequest(BaseModel):
    query: str
    answer: str | None = None


class TitleResponse(BaseModel):
    title: str


@router.post("/chat/title", response_model=TitleResponse)
async def chat_title(req: TitleRequest):
    title = await generate_title(req.query, req.answer or "")
    return TitleResponse(title=title)
