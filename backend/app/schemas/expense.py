from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from app.models.enum import ValueType, UnitType
from .product import ProductOut
from .detail import DetailOut

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
    # first stick the easier minimal api
    # product: Optional[ProductOut] = None
    # detail: Optional[DetailOut] = None

    class Config:
        # Pydantic knows how to read SQLAlchemy ORM objects:
        # so don't need to be dict-like objects
        orm_mode = True
