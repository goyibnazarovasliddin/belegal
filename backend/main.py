import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import chat, documents
from .auth.router import router as auth_router
from .database import init_db
from .rag.ingest import ingest

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    count = ingest()
    log.info(f"BeLegal ready — {count} articles indexed (BM25).")
    yield


app = FastAPI(title="BeLegal API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat.router)
app.include_router(documents.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/ingest")
def reingest(reset: bool = False):
    count = ingest(reset=reset)
    return {"ingested": count}
