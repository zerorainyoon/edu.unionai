from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Field, SQLModel

class CommentBase(SQLModel):
    """
    Shared attributes for Comment model.
    """
    content: str = Field(nullable=False)
    parent_id: Optional[int] = Field(default=None, foreign_key="comments.id", nullable=True)

class Comment(CommentBase, table=True):
    """
    Database Table Entity Model for Comment.
    """
    __tablename__: str = "comments"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int = Field(foreign_key="posts.id", nullable=False)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

class CommentCreate(CommentBase):
    """
    DTO for Comment creation requests.
    """
    pass

class CommentResponse(SQLModel):
    """
    DTO for flat Comment responses.
    """
    id: int
    post_id: int
    user_id: int
    parent_id: Optional[int]
    content: str
    created_at: datetime
    updated_at: datetime

class CommentTreeResponse(CommentResponse):
    """
    DTO for hierarchical (Tree structure) Comment responses.
    """
    replies: List["CommentTreeResponse"] = []
