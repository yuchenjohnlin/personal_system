from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, date, time
from typing import List, Optional

from app.deps.database import get_db
from app.models import Purchase, Expense
from app.schemas.purchase import PurchaseCreate, PurchaseUpdate, PurchaseOut

router = APIRouter(prefix="/purchases", tags=["Purchases"])

@router.post("", response_model=PurchaseOut)
def create_purchase(payload: PurchaseCreate, db: Session = Depends(get_db)):
    purchase = Purchase(
        location=payload.location,
        receipt=payload.receipt,
        purchased_at=payload.purchased_at,
        whole_discount_value=payload.whole_discount_value,
        whole_discount_kind=payload.whole_discount_kind,
    )
    db.add(purchase)
    db.flush()

    if payload.expenses:
        for exp in payload.expenses:
            db.add(
                Expense(
                    purchase_id=purchase.id,
                    price=exp.price,
                    tax_value=exp.tax_value,
                    tip_value=exp.tip_value,
                    product_id=exp.product_id,
                    detail_id=exp.detail_id,
                )
            )
    db.commit()
    db.refresh(purchase)
    return purchase


@router.get("/{purchase_id}", response_model=PurchaseOut)
def get_purchase(purchase_id: int, db: Session = Depends(get_db)):
    purchase = (
        db.query(Purchase)
        .filter(Purchase.id == purchase_id)
        .first()
    )
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return purchase

@router.get("", response_model=List[PurchaseOut])
def list_purchases(
    date: Optional[date] = Query(None, description="Filter purchases by date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    query = db.query(Purchase)
    print(date)

    if date:
        start = datetime.combine(date, time.min)
        end = datetime.combine(date, time.max)
        query = query.filter(Purchase.purchased_at >= start, Purchase.purchased_at <= end)

    return query.all()



@router.patch("/{purchase_id}", response_model=PurchaseOut)
def update_purchase(purchase_id: int, payload: PurchaseUpdate, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    data = payload.dict(exclude_unset=True)
    for field, value in data.items():
        setattr(purchase, field, value)

    db.commit()
    db.refresh(purchase)
    return purchase

@router.delete("/{purchase_id}", response_model=PurchaseOut)
def delete_purchase(purchase_id: int, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    # expenses relationship uses cascade delete-orphan, so deleting purchase removes its expenses
    db.delete(purchase)
    db.commit()
    return purchase
