from fastapi import Request, Depends, HTTPException
from app.deps.database import get_db
from app.core.session import get_user_id_from_session
from app.models.user import User

def get_current_user(request: Request, db = Depends(get_db)):
    # raise can handle errors by exception handlers, which convert exceptions into HTTP responses
    # it stops further processing , prevent sending unecessary data
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(401, "Not authenticated")

    user_id = get_user_id_from_session(session_id)
    if not user_id:
        raise HTTPException(401, "Session expired")
    # is it possible to find the user in the redis, but not find the user in the database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(401, "Invalid user")

    return user
