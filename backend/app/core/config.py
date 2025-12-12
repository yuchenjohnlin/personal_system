# app/core/config.py

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_URL: str = "sqlite:///expense.sqlite"
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    SESSION_EXPIRE_SECONDS: int = 60 * 60 * 24
    DEBUG: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
