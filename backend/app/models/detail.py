from .base import Base
from datetime import datetime
from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    text,
    ForeignKey,
    Index,
    Float,
    Numeric,
    Enum,
)
from .enum import ValueType, UnitType
from sqlalchemy.orm import relationship

class Detail(Base):
    __tablename__ = 'detail'

    id = Column(Integer, primary_key=True, index=True)
    original_price = Column(Integer, nullable=True)

    # Discount is either an absolute amount or a percent
    discount_value = Column(Numeric(10, 4))  # store absolute amount or percent fraction (e.g., 0.15)
    discount_kind = Column(
        Enum("amount", "percent", name="discount_kind"),
        nullable=True,
    )

    # keep both weight and count fields to allow flexibility
    # ---- WEIGHT FIELDS ----
    physical_weight = Column(Numeric(10, 4), nullable=True)      # e.g., 3.52
    physical_weight_unit = Column(String, nullable=True)          # e.g., "lb", "kg", "g"

    # ---- COUNT FIELDS ----
    physical_count = Column(Integer, nullable=True)               # e.g., 12 eggs
    physical_count_unit = Column(String, nullable=True)
    # TODO : why do I need to have a primary unit type?
    primary_unit_type = Column(
        Enum(UnitType, name="unit_type_enum"),
        nullable=True,
    )   

    original_unit_price = Column(Numeric(10, 4), nullable=True)
    unit_price = Column(Numeric(10, 4), nullable=True)