from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.security import hash_password
from app.core.database import get_db
from app.models import User, UserCredential, UserProfile
from app.schemas.user import UserCreate, UserUpdate, UserProfileOut

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("", response_model=UserProfileOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    # Create base user 
    user = User()
    db.add(user)
    db.flush()

    hashed_passwd = hash_password(payload.credentials.password)
    # create a python ORM object
    # the reason that we can't do something similar to **payload...dict
    # because the credentials payload has a password key which is not in the model
    cred = UserCredential(
        user_id=user.id,
        username=payload.credentials.username,
        email=payload.credentials.email,
        password_hash=hashed_passwd,
    )
    db.add(cred)

    # when FastAPI revceives JSON, it parses it to Pydantic Objects
    # but SQLAlchemy expects a dict to update fields 
    # if you don't use exclude_unset, then the fields that are not set will become None, 
    # which will be dangerous because it will overwrite that with None, instead of doing nothing in SQLAlchemy
    if payload.profile is not None:
        profile = UserProfile(
            user_id = user.id,
            **payload.profile.dict(exclude_unset=True)
        )
        db.add(profile)

    db.commit()
    db.refresh(user)
    return user
