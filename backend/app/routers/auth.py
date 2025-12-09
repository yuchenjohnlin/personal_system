from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.security import hash_password
from app.core.database import get_db
from app.models import User, UserCredential, UserProfile
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.schemas.auth import LoginRequest
from app.core.security import verify_password

import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):

    # 1. Find by username
    cred = db.query(UserCredential).filter(
        # UserCredential.username == payload.username
        UserCredential.email == payload.email
        ).first()
    logger.info("cred : %s", cred)
    if not cred:
        raise HTTPException(status_code=400, detail="Username not found")
    
    # Verify password
    if not verify_password(payload.password, cred.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # 3. For now, just return the user id (no session yet)
    return {
        "message": "Login successful",
        "user_id": cred.user_id
    }