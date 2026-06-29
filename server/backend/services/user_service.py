from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from backend.models.user import User, UserCreate
from backend.core.auth import get_password_hash, verify_password

class UserService:
    """
    Handles business logic and database interactions for Users.
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, user_id: int) -> Optional[User]:
        """
        Retrieve a user by their ID.
        """
        statement = select(User).where(User.id == user_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve a user by their email address.
        """
        statement = select(User).where(User.email == email)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Retrieve list of users with pagination.
        """
        statement = select(User).offset(skip).limit(limit)
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def create(self, user_create: UserCreate) -> User:
        """
        Creates a new user with hashed password.
        """
        # Create user entity
        user = User(
            email=user_create.email,
            full_name=user_create.full_name,
            is_active=user_create.is_active,
            is_admin=user_create.is_admin,
            hashed_password=get_password_hash(user_create.password),
        )
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
