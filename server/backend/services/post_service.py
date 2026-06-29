from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, col, or_
from backend.models.post import Post, PostCreate, PostUpdate
from backend.core.auth import get_password_hash

class PostService:
    """
    Handles business logic and database interactions for Posts.
    """
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, post_id: int) -> Optional[Post]:
        """
        Retrieve a post by its ID.
        """
        statement = select(Post).where(Post.id == post_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_all(
        self, search: Optional[str] = None, skip: int = 0, limit: int = 100
    ) -> List[Post]:
        """
        Retrieve a list of posts with pagination and keyword search on title/content.
        """
        statement = select(Post)
        if search:
            search_query = f"%{search}%"
            statement = statement.where(
                or_(
                    col(Post.title).like(search_query),
                    col(Post.content).like(search_query)
                )
            )
        # Order by created_at descending by default for better UX
        statement = statement.order_by(col(Post.created_at).desc()).offset(skip).limit(limit)
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def create(self, post_create: PostCreate, user_id: int) -> Post:
        """
        Creates a new post. Hashes post password if it is private.
        """
        hashed_password = None
        if post_create.is_private and post_create.password:
            hashed_password = get_password_hash(post_create.password)

        db_post = Post(
            title=post_create.title,
            content=post_create.content,
            is_private=post_create.is_private,
            hashed_post_password=hashed_password,
            user_id=user_id,
            views=0,
        )
        self.session.add(db_post)
        await self.session.commit()
        await self.session.refresh(db_post)
        return db_post

    async def update(self, db_post: Post, post_update: PostUpdate) -> Post:
        """
        Updates an existing post. Handles private settings and password updates.
        """
        update_data = post_update.model_dump(exclude_unset=True)
        
        # If password is provided in update
        if "password" in update_data:
            password = update_data.pop("password")
            if password:
                db_post.hashed_post_password = get_password_hash(password)
            else:
                db_post.hashed_post_password = None

        # Apply other updates
        for key, value in update_data.items():
            setattr(db_post, key, value)

        # Clean up password if post is changed to public
        if not db_post.is_private:
            db_post.hashed_post_password = None

        db_post.updated_at = datetime.now(timezone.utc)
        self.session.add(db_post)
        await self.session.commit()
        await self.session.refresh(db_post)
        return db_post

    async def increment_views(self, db_post: Post) -> Post:
        """
        Increments the view count of a post.
        """
        db_post.views += 1
        self.session.add(db_post)
        await self.session.commit()
        await self.session.refresh(db_post)
        return db_post

    async def delete(self, db_post: Post) -> None:
        """
        Deletes a post. Comments will be deleted automatically due to foreign key cascade.
        """
        await self.session.delete(db_post)
        await self.session.commit()
