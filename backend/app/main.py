from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from db.database import ValueType, UnitType

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from db.database import (
    Expense,
    Purchase,
    SessionLocal,
    init_db,
)

# This schema is not related to the database schema 
# So there are 2 separated concepts here:
# 1. Dependencies : Things like db sessions or get_current_user, which are injected 
# 2. Request / response models: APIs are for people to communicate and use, but have to define the usage interface
# which are defined as the Pydantic models below

# ---------- Pydantic schemas ----------

class ExpenseCreate(BaseModel):
    
    price: Decimal

    tax_value: Optional[Decimal] = None
    tax_kind: Optional[ValueType] = None

    tip_value: Optional[Decimal] = None
    tip_kind: Optional[ValueType] = None

    product_id: Optional[int] = None
    detail_id: Optional[int] = None


class ExpenseUpdate(BaseModel):
    # um anyways, chatgpt says that the id field should be inclueded in the url 
    # so it doesn't need to be in the payload
    price: Optional[Decimal] = None

    tax_value: Optional[Decimal] = None
    tax_kind: Optional[ValueType] = None

    tip_value: Optional[Decimal] = None
    tip_kind: Optional[ValueType] = None

    product_id: Optional[int] = None
    detail_id: Optional[int] = None


class ExpenseOut(BaseModel):
    id: int
    purchase_id: int
    price: Decimal
    tax_value: Optional[Decimal] = None
    tax_kind: Optional[ValueType] = None

    tip_value: Optional[Decimal] = None
    tip_kind: Optional[ValueType] = None
    product_id: Optional[int]
    detail_id: Optional[int]

    class Config:
        orm_mode = True


class PurchaseCreate(BaseModel):
    location: Optional[str] = None
    receipt: Optional[str] = None
    time: Optional[datetime] = Field(default_factory=datetime.utcnow)

    whole_discount_value: Optional[Decimal] = None
    whole_discount_kind: Optional[ValueType] = None

    final_price: Optional[Decimal] = None
    expenses: Optional[List[ExpenseCreate]] = None


class PurchaseUpdate(BaseModel):
    location: Optional[str] = None
    receipt: Optional[str] = None
    purchased_at: Optional[datetime] = None
    whole_discount_value: Optional[Decimal] = None
    whole_discount_kind: Optional[ValueType] = None
    final_price: Optional[Decimal] = None


class PurchaseOut(BaseModel):
    id: int
    location: str
    receipt: Optional[str]
    time: datetime
    whole_discount_value: Optional[Decimal]
    whole_discount_kind: Optional[ValueType]
    final_price: Optional[Decimal]
    expenses: List[ExpenseOut] = []

    class Config:
        orm_mode = True


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


@app.post("/purchases", response_model=PurchaseOut)
def create_purchase(payload: PurchaseCreate, db: Session = Depends(get_db)):
    purchase = Purchase(
        location=payload.location,
        receipt=payload.receipt,
        time=payload.purchased_at or datetime.utcnow(),
        whole_discount_value=payload.whole_discount_value,
        whole_discount_kind=payload.whole_discount_kind,
        final_price=payload.final_price,
    )
    db.add(purchase)
    db.flush()

    if payload.expenses:
        for exp in payload.expenses:
            db.add(
                Expense(
                    purchase_id=purchase.id,
                    price=exp.price,
                    tax_value=exp.tax_value,
                    tip_value=exp.tip_value,
                    product_id=exp.product_id,
                    detail_id=exp.detail_id,
                )
            )
    db.commit()
    db.refresh(purchase)
    return purchase


@app.get("/purchases/{purchase_id}", response_model=PurchaseOut)
def get_purchase(purchase_id: int, db: Session = Depends(get_db)):
    purchase = (
        db.query(Purchase)
        .filter(Purchase.id == purchase_id)
        .first()
    )
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return purchase


@app.patch("/purchases/{purchase_id}", response_model=PurchaseOut)
def update_purchase(purchase_id: int, payload: PurchaseUpdate, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    data = payload.dict(exclude_unset=True)
    if "purchased_at" in data:
        # map to DB field "time"
        purchase.time = data.pop("purchased_at")
    for field, value in data.items():
        setattr(purchase, field, value)

    db.commit()
    db.refresh(purchase)
    return purchase


@app.post("/expenses", response_model=ExpenseOut)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    # ensure purchase exists
    if not db.query(Purchase.id).filter_by(id=payload.purchase_id).first():
        raise HTTPException(status_code=400, detail="Purchase does not exist")
    expense = Expense(
        purchase_id=payload.purchase_id,
        price=payload.price,
        tax_value=payload.tax_value,
        tip_value=payload.tip_value,
        product_id=payload.product_id,
        detail_id=payload.detail_id,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@app.patch("/expenses/{expense_id}", response_model=ExpenseOut)
def update_expense(expense_id: int, payload: ExpenseUpdate, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense


@app.get("/health")
def health():
    return {"status": "ok"}
