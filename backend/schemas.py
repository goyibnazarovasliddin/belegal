from pydantic import BaseModel
from typing import List, Optional


class ChatRequest(BaseModel):
    query: str


class Source(BaseModel):
    id: str
    modda: str
    bob: Optional[str] = None
    bolim: Optional[str] = None
    text: str
    document: str


class Modda(BaseModel):
    id: str
    number: str
    text: str
    bob: Optional[str] = None
    bolim: Optional[str] = None


class Bob(BaseModel):
    name: str
    bolim: Optional[str] = None
    moddalar: List[Modda]


class LegalDocument(BaseModel):
    name: str
    bobs: List[Bob]


class DocumentsResponse(BaseModel):
    documents: List[LegalDocument]
