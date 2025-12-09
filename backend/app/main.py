from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, init_db
from app.models import Expense, Purchase
from app.routers import auth, user, expense, purchase
from app.core.database import get_db

# This schema is not related to the database schema 
# So there are 2 separated concepts here:
# 1. Dependencies : Things like db sessions or get_current_user, which are injected 
# 2. Request / response models: APIs are for people to communicate and use, but have to define the usage interface
# which are defined as the Pydantic models below

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

# Register routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(expense.router)
app.include_router(purchase.router)
