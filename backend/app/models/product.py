from .base import Base
from datetime import datetime
from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    ForeignKey,
    Index,
)
from .enum import ValueType
from sqlalchemy.orm import relationship

class Product(Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, index=True)
    product_name_id = Column(Integer, ForeignKey("product_names.id", ondelete="SET NULL"))
    item_id = Column(Integer, ForeignKey("items.id", ondelete="SET NULL"))
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"))
    
    # ORM relationships
    name = relationship("ProductName", back_populates="products")   # a product has many names
    item = relationship("Item", back_populates="products")
    category = relationship("Category", back_populates="products")
