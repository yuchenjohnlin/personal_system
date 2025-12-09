from .base import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

class ProductName(Base):
    __tablename__ = 'product_names'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    products = relationship("Product", back_populates="name")
