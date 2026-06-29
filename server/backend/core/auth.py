import base64
import hashlib
import hmac
import json
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from sqlmodel import select
from backend.core.config import settings
from backend.core.db import get_session
from backend.models.user import User

security = HTTPBearer(auto_error=False)

def get_password_hash(password: str) -> str:
    """
    Generate pbkdf2 hash of password.
    """
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return f"{salt.hex()}:{key.hex()}"

def verify_password(plain_password: str, hashed_password: Optional[str]) -> bool:
    """
    Verify plain password against a pbkdf2 hash.
    """
    if not hashed_password:
        return False
    try:
        salt_hex, key_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        key = bytes.fromhex(key_hex)
        new_key = hashlib.pbkdf2_hmac(
            "sha256", plain_password.encode("utf-8"), salt, 100000
        )
        return hmac.compare_digest(new_key, key)
    except Exception:
        return False

def create_access_token(user_id: int) -> str:
    """
    Generate a cryptographically signed access token (JWT-like structure)
    """
    payload = {
        "sub": user_id,
        "exp": (datetime.now(timezone.utc) + timedelta(days=1)).timestamp()
    }
    payload_bytes = json.dumps(payload).encode("utf-8")
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode("utf-8")
    signature = hmac.new(settings.SECRET_KEY.encode("utf-8"), payload_bytes, hashlib.sha256).digest()
    signature_b64 = base64.urlsafe_b64encode(signature).decode("utf-8")
    return f"{payload_b64}.{signature_b64}"

def verify_access_token(token: str) -> Optional[int]:
    """
    Verify the cryptographically signed access token and return user ID if valid.
    """
    try:
        payload_b64, signature_b64 = token.split(".")
        payload_bytes = base64.urlsafe_b64decode(payload_b64.encode("utf-8"))
        expected_signature = hmac.new(settings.SECRET_KEY.encode("utf-8"), payload_bytes, hashlib.sha256).digest()
        expected_signature_b64 = base64.urlsafe_b64encode(expected_signature).decode("utf-8")
        if not hmac.compare_digest(signature_b64, expected_signature_b64):
            return None
        payload = json.loads(payload_bytes.decode("utf-8"))
        if payload.get("exp", 0) < datetime.now(timezone.utc).timestamp():
            return None
        return int(payload.get("sub"))
    except Exception:
        return None

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: AsyncSession = Depends(get_session)
) -> User:
    """
    FastAPI dependency to retrieve the currently authenticated user.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization credentials missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    user_id = verify_access_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user does not exist",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account"
        )
    return user
