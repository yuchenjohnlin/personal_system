from .base import Base
from sqlalchemy import (
    Column,
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

class Expense(Base):
    __tablename__ = 'expenses'
    __table_args__ = (
        Index("idx_expenses_purchase", "purchase_id"),
        Index("idx_expenses_product", "product_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Numeric(10, 4), nullable=False)

    # Tax 
    tax_value = Column(Numeric(10, 4))  
    tax_kind = Column(
        Enum(ValueType, name="tax_kind"),
        nullable=True,
    )

    # Tip
    tip_value = Column(Numeric(10, 4), nullable=True)  
    tip_kind = Column(
        Enum(ValueType, name="tip_kind"),
        nullable=True,
    )
    
    product_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    detail_id = Column(Integer, ForeignKey("detail.id", ondelete="SET NULL"))
    # if the purchase is deleted, delete all associated expenses
    purchase_id = Column(Integer, ForeignKey("purchases.id", ondelete="CASCADE"), nullable=False)

    # ORM relationships
    purchase = relationship("Purchase", back_populates="expenses")
    product = relationship("Product", back_populates="expenses", uselist=False)
    detail = relationship("Detail", back_populates="expenses", uselist=False)
