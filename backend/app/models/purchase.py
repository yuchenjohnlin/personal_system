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
from .enum import ValueType
from sqlalchemy.orm import relationship

class Purchase(Base):
    __tablename__ = 'purchases'
    # Index by purchase time for faster chronological queries
    __table_args__ = (Index("idx_purchases_purchased_at", "purchased_at"),)

    # we don't have a foreign key to each expense

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, nullable=True)
    receipt = Column(String, nullable=True)
    # time = Column(DateTime, default=datetime.utcnow)
    purchased_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    update_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    whole_discount_value = Column(Numeric(10, 4), nullable=True)  # store absolute amount or percent fraction (e.g., 0.15)
    whole_discount_kind = Column(
        Enum(ValueType, name="discount_kind"),
        nullable=True,
    )
    # this is the sum of the purchase after all discounts, tax, and tip
    # TODO : think if this is nullable
    final_price = Column(Numeric(10,4), nullable=False, default=0)

    # This is SQL Alchemy's way of defining relationships
    # Doesn't create actual foreign keys in the database
    expenses = relationship("Expense", back_populates="purchase", cascade="all, delete-orphan")
