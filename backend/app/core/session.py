import uuid
from app.core.redis import redis_client
from app.core.config import settings

SESSION_PREFIX = "session:"
SESSION_COOKIE = "session_id"


def create_session(user_id: int) -> str:
    session_id = str(uuid.uuid4())
    key = SESSION_PREFIX + session_id

    # store user_id with expiration
    redis_client.setex(
        key,
        settings.SESSION_EXPIRE_SECONDS,
        user_id
    )

    return session_id


def get_user_id_from_session(session_id: str) -> int | None:
    key = SESSION_PREFIX + session_id
    value = redis_client.get(key)
    if value is None:
        return None
    return int(value)


def delete_session(session_id: str):
    key = SESSION_PREFIX + session_id
    redis_client.delete(key)
