from .base import Base
from sqlalchemy import (
    Column,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

class Item(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False)
    products = relationship("Product", back_populates="item")
