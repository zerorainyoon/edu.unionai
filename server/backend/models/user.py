from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel

class UserBase(SQLModel):
    """
    Shared attributes for User model.
    """
    email: str = Field(index=True, unique=True, nullable=False)
    is_active: bool = Field(default=True)
    full_name: Optional[str] = Field(default=None)

class User(UserBase, table=True):
    """
    Database Table Entity Model for User.
    """
    __tablename__: str = "users"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

class UserCreate(UserBase):
    """
    DTO for User creation requests.
    """
    password: str

class UserResponse(SQLModel):
    """
    DTO for User responses returned to the client.
    """
    id: int
    email: str
    is_active: bool
    full_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
