import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Determine dynamic env file: .env.dev, .env.qa, .env.prod, etc.
# Fallback to .env if the environment-specific file does not exist.
env_state = os.getenv("ENVIRONMENT", "dev")
env_file_name = f".env.{env_state}"
if not os.path.exists(env_file_name) and os.path.exists(".env"):
    env_file_name = ".env"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=env_file_name,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "UnionAI API"
    SECRET_KEY: str

    # MariaDB Database Configurations
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str = "localhost"
    DB_PORT: int = 13306
    DB_NAME: str

    # CORS Origins (accepts comma-separated string or list)
    CORS_ORIGINS: Union[str, List[str]] = []

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    @property
    def database_url(self) -> str:
        """
        Generates the async MariaDB connection string.
        """
        return f"mysql+aiomysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

settings = Settings()  # type: ignore[call-arg]
