from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, validator


class UserProfileCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None

    display_name: Optional[str] = None
    timezone: Optional[str] = None
    locale: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    
    display_name: Optional[str] = None
    timezone: Optional[str] = None
    locale: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None

class UserProfileOut(BaseModel):
    id: int
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None

    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    locale: Optional[str] = None
    timezone: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        orm_mode = True

class UserCredentialCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)  # plaintext password from client

    @validator("password")
    def validate_complexity(cls, v):
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter")
        return v

class UserCredentialUpdate(BaseModel):
    email: EmailStr

class UserCredentialOut(BaseModel):
    # id: int # id is not actually needed to be passed back 
    user_id: int
    email: str # doesn't matter if you use EmailStr or not
    is_email_verified: bool
    last_login_at: Optional[datetime] = None

    # These shouldn't be passed, they are needed in the backend not frontend
    # password_changed_at: Optional[datetime] = None
    # last_login_ip: Optional[str] = None
    # failed_login_attempts: int
    # locked_until: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    credentials: UserCredentialCreate
    profile: Optional[UserProfileCreate] = None

class UserUpdate(BaseModel):
    credentials: Optional[UserCredentialUpdate] = None
    profile: Optional[UserProfileUpdate] = None

class UserOut(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
    profile: Optional[UserProfileOut] = None
    credentials: Optional[UserCredentialOut] = None

    class Config:
        orm_mode = True
