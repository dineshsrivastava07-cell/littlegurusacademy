"""JWT auth helpers — admin + student roles. Bearer header tokens."""
from __future__ import annotations

import os
import bcrypt
import jwt as pyjwt
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Header, Depends
from typing import Optional


def _secret() -> str:
    return os.environ["JWT_SECRET"]


def _algo() -> str:
    return os.environ.get("JWT_ALGO", "HS256")


def _expires_hours() -> int:
    return int(os.environ.get("JWT_EXPIRE_HOURS", "12"))


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(*, sub: str, role: str, extra: dict | None = None) -> str:
    payload = {
        "sub": sub,
        "role": role,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=_expires_hours()),
    }
    if extra:
        payload.update(extra)
    return pyjwt.encode(payload, _secret(), algorithm=_algo())


def _decode(token: str) -> dict:
    try:
        return pyjwt.decode(token, _secret(), algorithms=[_algo()])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def _extract_bearer(authorization: Optional[str]) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer" or not parts[1].strip():
        raise HTTPException(status_code=401, detail="Invalid auth header")
    return parts[1].strip()


def require_admin(authorization: Optional[str] = Header(None)) -> dict:
    token = _extract_bearer(authorization)
    payload = _decode(token)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return payload


def require_student(authorization: Optional[str] = Header(None)) -> dict:
    token = _extract_bearer(authorization)
    payload = _decode(token)
    if payload.get("role") != "student":
        raise HTTPException(status_code=403, detail="Student only")
    return payload


def require_any(authorization: Optional[str] = Header(None)) -> dict:
    token = _extract_bearer(authorization)
    return _decode(token)
