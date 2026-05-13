from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from ..database import get_db
from .schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from .service import create_user, authenticate, create_token, get_by_email, get_by_id, decode_token

router = APIRouter(prefix="/api/auth", tags=["auth"])
_bearer = HTTPBearer(auto_error=False)


def current_user_id(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
    db: Session = Depends(get_db),
) -> int:
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(creds.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return int(payload["sub"])


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if get_by_email(db, req.email):
        raise HTTPException(status_code=400, detail="Bu email allaqachon ro'yxatdan o'tgan")
    user = create_user(db, req.email, req.full_name, req.password)
    return TokenResponse(access_token=create_token(user.id, user.email))


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate(db, req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email yoki parol noto'g'ri")
    return TokenResponse(access_token=create_token(user.id, user.email))


@router.get("/me", response_model=UserResponse)
def me(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
    db: Session = Depends(get_db),
):
    if not creds:
        raise HTTPException(status_code=401)
    payload = decode_token(creds.credentials)
    if not payload:
        raise HTTPException(status_code=401)
    user = get_by_id(db, int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=404)
    return user
