from datetime import datetime
from enum import Enum as PyEnum
from pathlib import Path

from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    create_engine,
    text,
    ForeignKey,
    Index,
    Float,
    Numeric,
    Enum,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

DB_URL = "sqlite:///expense.sqlite" 


Base = declarative_base()

class ValueType(str, PyEnum):
    AMOUNT = "amount"
    PERCENT = "percent"

class UnitType(str, PyEnum):
    WEIGHT = "weight"
    COUNT = "count"


class Purchase(Base):
    __tablename__ = 'purchases'
    __table_args__ = (Index("idx_purchases_time", "time"),)

    # we don't have a foreign key to each expense

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, nullable=False)
    receipt = Column(String, nullable=True)
    time = Column(DateTime, default=datetime.utcnow)

    whole_discount_value = Column(Numeric(10, 4), nullable=True)  # store absolute amount or percent fraction (e.g., 0.15)
    whole_discount_kind = Column(
        Enum(ValueType, name="discount_kind"),
        nullable=True,
    )
    # this is the sum of the purchase after all discounts, tax, and tip
    # TODO : think if this is nullable
    final_price = Column(Numeric(10,4), nullable=True)

    # This is SQL Alchemy's way of defining relationships
    # Doesn't create actual foreign keys in the database
    expenses = relationship("Expense", back_populates="purchase", cascade="all, delete-orphan")


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

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    products = relationship("Product", back_populates="category")
    
class Item(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False)
    products = relationship("Product", back_populates="item")

class ProductName(Base):
    __tablename__ = 'product_names'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    products = relationship("Product", back_populates="name")

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

def get_engine(url: str = DB_URL):
    if url.startswith("sqlite:///"):
        Path(url.replace("sqlite:///", "")).parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(url, future=True)
    if engine.url.get_backend_name() == "sqlite":
        with engine.connect() as conn:
            conn.execute(text("PRAGMA foreign_keys=ON;"))
    return engine

def init_db(url: str = DB_URL):
    engine = get_engine(url)
    Base.metadata.create_all(engine)
    return engine

SessionLocal = sessionmaker(bind=get_engine(), autoflush=False, autocommit=False, future=True)

if __name__ == "__main__":
    init_db()