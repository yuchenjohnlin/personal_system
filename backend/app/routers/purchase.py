from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.models import Purchase, Expense
from app.schemas.purchase import PurchaseCreate, PurchaseUpdate, PurchaseOut

router = APIRouter(prefix="/purchases", tags=["Purchases"])

@router.post("", response_model=PurchaseOut)
def create_purchase(payload: PurchaseCreate, db: Session = Depends(get_db)):
    purchase = Purchase(
        location=payload.location,
        receipt=payload.receipt,
        time=payload.purchased_at or datetime.utcnow(),
        whole_discount_value=payload.whole_discount_value,
        whole_discount_kind=payload.whole_discount_kind,
        final_price=payload.final_price,
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


@router.patch("/{purchase_id}", response_model=PurchaseOut)
def update_purchase(purchase_id: int, payload: PurchaseUpdate, db: Session = Depends(get_db)):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    data = payload.dict(exclude_unset=True)
    if "purchased_at" in data:
        # map to DB field "time"
        purchase.time = data.pop("purchased_at")
    for field, value in data.items():
        setattr(purchase, field, value)

    db.commit()
    db.refresh(purchase)
    return purchase