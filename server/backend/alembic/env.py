import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

# Import SQLModel and base settings
from sqlmodel import SQLModel
from backend.core.config import settings

# Import models to ensure they are registered on the SQLModel metadata
from backend.models.user import User  # noqa: F401
from backend.models.course import Course  # noqa: F401
from backend.models.course_registration import CourseRegistration  # noqa: F401

# Alembic Config object
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the sqlalchemy.url dynamic config from settings
config.set_main_option("sqlalchemy.url", settings.database_url)

# Set target metadata for autogenerate support
target_metadata = SQLModel.metadata

def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection) -> None:  # type: ignore[no-untyped-def]
    """
    Runs migrations in transaction block sync context.
    """
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.
    """
    # Create database engine for migrations
    configuration = config.get_section(config.config_ini_section, {})
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
