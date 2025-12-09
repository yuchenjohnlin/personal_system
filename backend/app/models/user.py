from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from .base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # one-to-one helpers
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    credentials = relationship("UserCredential", back_populates="user", uselist=False, cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    username = Column(String, nullable=False) # I will still have a username here, and if this is not specified then maybe use the name
    display_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    locale = Column(String, nullable=True)
    timezone = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    user = relationship("User", back_populates="profile")


class UserCredential(Base):
    __tablename__ = "user_credentials"
    __table_args__ = (
        UniqueConstraint("email", name="uq_user_credentials_email"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    email = Column(String, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    password_hash = Column(String, nullable=False)  # store hashed password only
    password_changed_at = Column(DateTime, nullable=True)
    last_login_at = Column(DateTime, nullable=True)
    last_login_ip = Column(String, nullable=True)
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    locked_until = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="credentials")
