from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from app.models.enum import UnitType


class DetailOut(BaseModel):
    id: int
    original_price: Optional[int] = None
    discount_value: Optional[Decimal] = None
    discount_kind: Optional[str] = None
    physical_weight: Optional[Decimal] = None
    physical_weight_unit: Optional[str] = None
    physical_count: Optional[int] = None
    physical_count_unit: Optional[str] = None
    primary_unit_type: Optional[UnitType] = None
    original_unit_price: Optional[Decimal] = None
    unit_price: Optional[Decimal] = None

    class Config:
        orm_mode = True
