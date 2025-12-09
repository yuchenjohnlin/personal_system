from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, init_db
from app.models import Expense, Purchase

# This schema is not related to the database schema 
# So there are 2 separated concepts here:
# 1. Dependencies : Things like db sessions or get_current_user, which are injected 
# 2. Request / response models: APIs are for people to communicate and use, but have to define the usage interface
# which are defined as the Pydantic models below

# ---------- Database dependency ----------

# We do this because fastapi's dependency injection system
# dependency injection is a software design pattern where an object or function receives its dependencies from other sources
# opens a DB session per request
# gives it to the route handler
# closes it after the request is done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- App setup ----------

app = FastAPI(title="Personal Expense Tracker Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


# ---------- Routes ----------

@app.get("/health")
def health():
    return {"status": "ok"}
