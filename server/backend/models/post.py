from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Field, SQLModel

class PostBase(SQLModel):
    """
    Shared attributes for Post model.
    """
    title: str = Field(index=True, nullable=False)
    content: str = Field(nullable=False)
    is_private: bool = Field(default=False)
    author_name: Optional[str] = Field(default=None, nullable=True)

class Post(PostBase, table=True):
    """
    Database Table Entity Model for Post.
    """
    __tablename__: str = "posts"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_post_password: Optional[str] = Field(default=None, nullable=True)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    views: int = Field(default=0, nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

class PostCreate(PostBase):
    """
    DTO for Post creation requests.
    """
    password: Optional[str] = None

class PostUpdate(SQLModel):
    """
    DTO for Post update requests.
    """
    title: Optional[str] = None
    content: Optional[str] = None
    is_private: Optional[bool] = None
    password: Optional[str] = None

class PostResponse(SQLModel):
    """
    DTO for basic Post responses.
    """
    id: int
    title: str
    is_private: bool
    user_id: int
    views: int
    created_at: datetime
    updated_at: datetime
    author_name: Optional[str] = None

from backend.models.comment import CommentTreeResponse

class PostDetailResponse(PostResponse):
    """
    DTO for detailed Post responses containing content.
    """
    content: str
    comments: List[CommentTreeResponse] = []
