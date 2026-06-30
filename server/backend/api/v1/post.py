from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.db import get_session
from backend.core.auth import get_current_user, verify_access_token, security, verify_password
from backend.core.response_wrapper import UnifiedResponseRoute
from backend.models.user import User
from backend.models.post import PostCreate, PostUpdate, PostResponse, PostDetailResponse
from backend.models.comment import CommentTreeResponse
from backend.services.post_service import PostService
from backend.services.comment_service import CommentService
from backend.services.user_service import UserService

from fastapi.security import HTTPAuthorizationCredentials

router = APIRouter(prefix="/posts", tags=["Posts"], route_class=UnifiedResponseRoute)

async def get_post_service(session: AsyncSession = Depends(get_session)) -> PostService:
    return PostService(session)

async def get_comment_service(session: AsyncSession = Depends(get_session)) -> CommentService:
    return CommentService(session)

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: AsyncSession = Depends(get_session)
) -> Optional[User]:
    if not credentials:
        return None
    token = credentials.credentials
    user_id = verify_access_token(token)
    if not user_id:
        return None
    user_service = UserService(session)
    user = await user_service.get_by_id(user_id)
    if not user or not user.is_active:
        return None
    return user

@router.post(
    "/",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new post",
    description="Creates a new post. If private, requires a password.",
)
async def create_post(
    post_data: PostCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    if post_data.is_private and not post_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required for private posts.",
        )
    
    if current_user:
        user_id = current_user.id
    else:
        # Get or create anonymous guest user
        from backend.models.user import User as DBUser
        from sqlmodel import select
        
        stmt = select(DBUser).where(DBUser.email == "anonymous@unionai.com")
        res = await post_service.session.execute(stmt)
        anon_user = res.scalar_one_or_none()
        if not anon_user:
            anon_user = DBUser(
                email="anonymous@unionai.com",
                hashed_password="disabled_password_hash",
                full_name="비회원",
                is_active=True,
                is_admin=False
            )
            post_service.session.add(anon_user)
            await post_service.session.commit()
            await post_service.session.refresh(anon_user)
        user_id = anon_user.id

    assert user_id is not None
    post = await post_service.create(post_data, user_id)
    return post  # type: ignore[return-value]

@router.get(
    "/",
    response_model=List[PostResponse],
    status_code=status.HTTP_200_OK,
    summary="List all posts",
    description="Lists posts with pagination and search parameters.",
)
async def list_posts(
    search: Optional[str] = Query(None, description="Search keyword for title or content"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=9999),
    post_service: PostService = Depends(get_post_service),
) -> List[PostResponse]:
    return await post_service.get_all(search=search, skip=skip, limit=limit)  # type: ignore[return-value]

@router.get(
    "/{post_id}",
    response_model=PostDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get post details",
    description="Gets detailed post by ID. Private posts require password or author/admin rights.",
)
async def get_post(
    post_id: int,
    password: Optional[str] = Query(None, description="Password for private posts"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    post_service: PostService = Depends(get_post_service),
    comment_service: CommentService = Depends(get_comment_service),
) -> PostDetailResponse:
    post = await post_service.get_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )
    assert post.id is not None

    # Access control for private posts
    if post.is_private:
        # Check permissions:
        # 1. Admin has access
        # 2. Author has access
        # 3. If correct password is provided
        is_author = current_user is not None and current_user.id == post.user_id
        is_admin = current_user is not None and current_user.is_admin
        password_matches = password is not None and verify_password(password, post.hashed_post_password)

        if not (is_author or is_admin or password_matches):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This post is private. Access denied (password required).",
            )

    # Increment view count
    post = await post_service.increment_views(post)

    # Get comments and build tree
    flat_comments = await comment_service.get_all_by_post_id(post_id)
    comment_tree = CommentService.build_comment_tree(flat_comments)

    # Map to detailed DTO
    response = PostDetailResponse(
        id=post_id,
        title=post.title,
        content=post.content,
        is_private=post.is_private,
        user_id=post.user_id,
        views=post.views,
        created_at=post.created_at,
        updated_at=post.updated_at,
        comments=comment_tree
    )
    return response

@router.put(
    "/{post_id}",
    response_model=PostResponse,
    status_code=status.HTTP_200_OK,
    summary="Update post details",
    description="Updates post by ID. Only the author can update.",
)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    post = await post_service.get_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    assert current_user.id is not None
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the author can update this post.",
        )

    # If is_private is being set to True, password must be provided or already set
    is_private_target = post_data.is_private if post_data.is_private is not None else post.is_private
    if is_private_target and not post_data.password and not post.hashed_post_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is required to make a post private.",
        )

    updated_post = await post_service.update(post, post_data)
    return updated_post  # type: ignore[return-value]

@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a post",
    description="Deletes post by ID. Only the author or administrators can delete.",
)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service),
) -> None:
    post = await post_service.get_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found",
        )

    assert current_user.id is not None
    if post.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the author or administrators can delete this post.",
        )

    await post_service.delete(post)
