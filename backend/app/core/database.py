# app/core/database.py

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.base import Base

from app.models.purchase import Purchase
from app.models.expense import Expense
from app.models.product import Product
from app.models.category import Category
from app.models.item import Item
from app.models.productname import ProductName
from app.models.detail import Detail

# engine, session, etc.
from datetime import datetime
from enum import Enum as PyEnum
from pathlib import Path

from app.core.config import settings
from app.models.base import Base

from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    create_engine,
    text,
    ForeignKey,
    Index,
    Float,
    Numeric,
    Enum,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker


# ---------- Database dependency ----------

# We do this because fastapi's dependency injection system
# dependency injection is a software design pattern where an object or function receives its dependencies from other sources
# opens a DB session per request
# gives it to the route handler
# closes it after the request is done


def get_engine(url: str = settings.DB_URL):
    if url.startswith("sqlite:///"):
        Path(url.replace("sqlite:///", "")).parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(url, future=True)
    if engine.url.get_backend_name() == "sqlite":
        with engine.connect() as conn:
            conn.execute(text("PRAGMA foreign_keys=ON;"))
    return engine

SessionLocal = sessionmaker(bind=get_engine(), autoflush=False, autocommit=False, future=True)

def init_db(url: str = settings.DB_URL):
    engine = get_engine(url)
    Base.metadata.create_all(engine)
    return engine