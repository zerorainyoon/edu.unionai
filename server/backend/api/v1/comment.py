from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.db import get_session
from backend.core.auth import get_current_user
from backend.core.response_wrapper import UnifiedResponseRoute
from backend.models.user import User
from backend.models.comment import CommentCreate, CommentResponse
from backend.services.comment_service import CommentService
from backend.services.post_service import PostService

router = APIRouter(route_class=UnifiedResponseRoute)

async def get_comment_service(session: AsyncSession = Depends(get_session)) -> CommentService:
    return CommentService(session)

async def get_post_service(session: AsyncSession = Depends(get_session)) -> PostService:
    return PostService(session)

@router.post(
    "/posts/{post_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Comments"],
    summary="Create a new comment or reply",
    description="Adds a comment or nested reply to a post. Only administrators are allowed.",
)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    comment_service: CommentService = Depends(get_comment_service),
    post_service: PostService = Depends(get_post_service),
) -> CommentResponse:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can add comments.",
        )

    # Verify post exists
    post = await post_service.get_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    # If it is a reply, verify parent comment exists and belongs to the same post
    if comment_data.parent_id is not None:
        parent_comment = await comment_service.get_by_id(comment_data.parent_id)
        if not parent_comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent comment not found",
            )
        if parent_comment.post_id != post_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent comment does not belong to this post.",
            )

    assert current_user.id is not None
    comment = await comment_service.create(comment_data, post_id, current_user.id)
    return comment  # type: ignore[return-value]

@router.delete(
    "/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Comments"],
    summary="Delete a comment",
    description="Deletes a comment. Only the author or administrators can delete.",
)
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    comment_service: CommentService = Depends(get_comment_service),
) -> None:
    comment = await comment_service.get_by_id(comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found",
        )

    assert current_user.id is not None
    if comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the author or administrators can delete this comment.",
        )

    await comment_service.delete(comment)
