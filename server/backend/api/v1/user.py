from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.core.db import get_session
from backend.models.user import UserCreate, UserResponse
from backend.services.user_service import UserService

from backend.core.response_wrapper import UnifiedResponseRoute

router = APIRouter(prefix="/users", tags=["Users"], route_class=UnifiedResponseRoute)

async def get_user_service(session: AsyncSession = Depends(get_session)) -> UserService:
    """
    Dependency injection provider for UserService.
    """
    return UserService(session)

@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
    description="Registers a new user with a unique email and hashes their password.",
)
async def create_user(
    user_data: UserCreate,
    service: UserService = Depends(get_user_service),
) -> UserResponse:
    """
    API endpoint to create a user. Raises 400 Bad Request if the email is already registered.
    """
    existing_user = await service.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = await service.create(user_data)
    return user  # type: ignore[return-value]

@router.get(
    "/",
    response_model=List[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="Retrieve users list",
    description="Fetches a list of registered users with support for pagination.",
)
async def get_users(
    skip: int = 0,
    limit: int = 100,
    service: UserService = Depends(get_user_service),
) -> List[UserResponse]:
    """
    API endpoint to query a list of users.
    """
    users = await service.get_all(skip=skip, limit=limit)
    return users  # type: ignore[return-value]

@router.get(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user details",
    description="Retrieves profile information for a specific user using their unique ID.",
)
async def get_user(
    user_id: int,
    service: UserService = Depends(get_user_service),
) -> UserResponse:
    """
    API endpoint to retrieve details for a single user. Raises 404 if user not found.
    """
    user = await service.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user  # type: ignore[return-value]
