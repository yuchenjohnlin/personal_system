# app/core/config.py

from pydantic import BaseSettings


class Settings(BaseSettings):
    DB_URL: str = "sqlite:///expense.sqlite"
    DEBUG: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
