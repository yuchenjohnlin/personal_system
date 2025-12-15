from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from app.models.enum import ValueType, UnitType
from .expense import ExpenseCreate, ExpenseOut

class PurchaseCreate(BaseModel):
    location: Optional[str] = None
    receipt: Optional[str] = None
    purchased_at: datetime

    whole_discount_value: Optional[Decimal] = None
    whole_discount_kind: Optional[ValueType] = None

    # final_price: Optional[Decimal] = None
    expenses: Optional[List[ExpenseCreate]] = None


class PurchaseUpdate(BaseModel):
    location: Optional[str] = None
    receipt: Optional[str] = None
    purchased_at: Optional[datetime] = None

    whole_discount_value: Optional[Decimal] = None
    whole_discount_kind: Optional[ValueType] = None
    # final_price: Optional[Decimal] = None


class PurchaseOut(BaseModel):
    id: int
    location: Optional[str]
    receipt: Optional[str]
    purchased_at: datetime

    whole_discount_value: Optional[Decimal]
    whole_discount_kind: Optional[ValueType]
    final_price: Optional[Decimal]
    expenses: List[ExpenseOut] = []

    class Config:
        orm_mode = True
