from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.deps.database import get_db
from app.deps.auth import get_current_user
from app.models import User, UserCredential, UserProfile
from app.schemas.user import UserCreate, UserUpdate, UserOut
from app.core.session import create_session, delete_session, SESSION_COOKIE
from app.schemas.auth import LoginRequest

import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):

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

    user = cred.user
    # 3. For now, just return the user id (no session yet)
    session_id = create_session(user.id)

    # set HttpOnly cookie - the other fields in the http cookie will prevent other people from using the session_id. 
    # the session_id is already randomly generated (hard to guess), even if others steal this
    # the httponly prevents javascripts from reading it. there are multiple ways used to secure the session id

    # Browsers automatically store it — your frontend does not see it in JS.
    response.set_cookie(
        key=SESSION_COOKIE,
        value=session_id,
        httponly=True,
        secure=False,   # set True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24,
    )

    # Receives your SQLAlchemy ORM user object
    # Converts it into a dictionary using your Pydantic model UserOut
    # Removes fields not included in UserOut
    # Sends the JSON result to the frontend

    return user

# this is needed becuase the frontend is not able to know the user  information just by the cookies.
# suppose the cookie is still there, so the backend knows that the user should be loggedin 
# but frontend needs to get this info to know if it should go to the login page.
@router.get("/me", response_model=UserOut)
def me(user = Depends(get_current_user)):
    return user

@router.post("/logout")
def logout(response: Response, request: Request):
    session_id = request.cookies.get(SESSION_COOKIE)
    if session_id:
        delete_session(session_id)

    response.delete_cookie(SESSION_COOKIE)
    return {"status": "logged out"}