from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings

# Create async engine with pooling settings optimized for production
engine = create_async_engine(
    settings.database_url,
    pool_size=20,          # Base connection pool size
    max_overflow=10,       # Maximum extra connections above pool_size
    pool_recycle=1800,     # Recycle connections after 30 minutes
    pool_pre_ping=True,    # Test connections before using them
    echo=False             # Set to True for SQL query debugging
)

# Create an async session class
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency provider for async DB session.
    Automatically handles rollback on error and closes the session.
    """
    async with AsyncSessionLocal() as session:  # type: ignore[misc]
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
