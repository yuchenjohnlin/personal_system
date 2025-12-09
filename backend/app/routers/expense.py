from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.models import Purchase, Expense
from app.schemas.expense import ExpenseOut, ExpenseUpdate, ExpenseCreate

router = APIRouter(prefix="/expenses", tags=["Expenses"])
@router.post("/", response_model=ExpenseOut)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    # ensure purchase exists
    if not db.query(Purchase.id).filter_by(id=payload.purchase_id).first():
        raise HTTPException(status_code=400, detail="Purchase does not exist")
    expense = Expense(
        purchase_id=payload.purchase_id,
        price=payload.price,
        tax_value=payload.tax_value,
        tip_value=payload.tip_value,
        product_id=payload.product_id,
        detail_id=payload.detail_id,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.patch("/{expense_id}", response_model=ExpenseOut)
def update_expense(expense_id: int, payload: ExpenseUpdate, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense
