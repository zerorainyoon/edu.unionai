from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from backend.core.db import get_session
from backend.services.user_service import UserService
from backend.core.auth import verify_password, create_access_token
from backend.core.response_wrapper import UnifiedResponseRoute

router = APIRouter(prefix="/auth", tags=["Auth"], route_class=UnifiedResponseRoute)

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Login to get access token",
    description="Authenticates user by email/password and returns a bearer token.",
)
async def login(
    login_data: LoginRequest,
    session: AsyncSession = Depends(get_session)
) -> TokenResponse:
    """
    API endpoint for logging in. Raises 401 Unauthorized if invalid credentials.
    """
    user_service = UserService(session)
    user = await user_service.get_by_email(login_data.email)
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )
        
    assert user.id is not None
    token = create_access_token(user.id)
    return TokenResponse(access_token=token, token_type="bearer")
