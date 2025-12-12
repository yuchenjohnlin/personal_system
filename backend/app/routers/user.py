from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.security import hash_password
from app.deps.database import get_db
from app.models import User, UserCredential, UserProfile
from app.schemas.user import UserCreate, UserUpdate, UserOut

import logging
logger = logging.getLogger(__name__)


router = APIRouter(prefix="/users", tags=["Users"])

@router.post("", response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    logger.info("create user : ", payload)
    # check uniqueness 
    if db.query(UserCredential).filter_by(email=payload.credentials.email).first():
        raise HTTPException(400, "Email already registered")

    # simple password check
    if payload.credentials.password.lower() in payload.credentials.email.lower():
        raise HTTPException(400, "Password is too similar to email")
    
    hashed_passwd = hash_password(payload.credentials.password)
    
    # Create base user - this user in the model is not the credential
    user = User()
    db.add(user)
    db.flush()

    # create a python ORM object
    # the reason that we can't do something similar to **payload...dict
    # because the credentials payload has a password key which is not in the model
    cred = UserCredential(
        user_id=user.id,
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

@router.delete("/{user_id}", response_model=UserOut)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return user
