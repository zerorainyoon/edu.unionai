from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, col
from backend.models.comment import Comment, CommentCreate, CommentTreeResponse

class CommentService:
    """
    Handles business logic and database interactions for Comments.
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, comment_id: int) -> Optional[Comment]:
        """
        Retrieve a comment by its ID.
        """
        statement = select(Comment).where(Comment.id == comment_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_all_by_post_id(self, post_id: int) -> List[Comment]:
        """
        Retrieve flat list of comments for a specific post.
        """
        statement = select(Comment).where(Comment.post_id == post_id).order_by(col(Comment.created_at).asc())
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def create(self, comment_create: CommentCreate, post_id: int, user_id: int) -> Comment:
        """
        Create a new comment or reply.
        """
        db_comment = Comment(
            post_id=post_id,
            user_id=user_id,
            parent_id=comment_create.parent_id,
            content=comment_create.content,
        )
        self.session.add(db_comment)
        await self.session.commit()
        await self.session.refresh(db_comment)
        return db_comment

    async def delete(self, db_comment: Comment) -> None:
        """
        Delete a comment. Children comments are automatically cascade deleted by DB foreign keys.
        """
        await self.session.delete(db_comment)
        await self.session.commit()

    @staticmethod
    def build_comment_tree(comments: List[Comment]) -> List[CommentTreeResponse]:
        """
        Helper method to convert a flat list of comments into a hierarchical tree structure.
        """
        comment_map = {}
        roots: List[CommentTreeResponse] = []

        # 1. Convert all Comments to CommentTreeResponse DTOs and map them
        for comment in comments:
            assert comment.id is not None
            node = CommentTreeResponse(
                id=comment.id,
                post_id=comment.post_id,
                user_id=comment.user_id,
                parent_id=comment.parent_id,
                content=comment.content,
                created_at=comment.created_at,
                updated_at=comment.updated_at,
                replies=[]
            )
            comment_map[comment.id] = node

        # 2. Connect parent and children nodes
        for comment in comments:
            assert comment.id is not None
            node = comment_map[comment.id]
            if comment.parent_id is not None:
                parent_node = comment_map.get(comment.parent_id)
                if parent_node is not None:
                    parent_node.replies.append(node)
                else:
                    # If parent comment is not found (e.g. deleted or outside query), make it root
                    roots.append(node)
            else:
                roots.append(node)

        return roots
