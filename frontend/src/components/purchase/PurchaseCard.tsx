import { useEffect, useRef, useState } from "react";
import "./PurchaseCard.css";
import type { PurchaseUpdateDTO, PurchaseReadDTO } from "../../api/purchases";
import { useAutosaveField } from "../../hooks/useAutoSaveField";
import type { EditingTarget } from "../../types/types";
import { InlineEdit } from "../common/InlineEdit";

type PurchaseCardProps = {
  purchase: PurchaseReadDTO;
  onDelete: (id: number) => void;
  onUpdate: (id: number, payload: Partial<PurchaseUpdateDTO>) => void;
  editingObj: EditingTarget;
  setEditingObj: (id: EditingTarget) => void;
};

// purchase card opens when clicking on the card, then shows expense entries. 
// each purchase should have the amount of money spent, but that could be added afterwards
export function PurchaseCard({
  purchase,
  onDelete,
  onUpdate,
  editingObj,
  setEditingObj,
}: PurchaseCardProps) {
  const [open, setOpen] = useState(false);
  const isEditingLocation = 
    editingObj?.type === "purchase" &&
    editingObj?.purchaseId === purchase.id &&
    editingObj?.field === "location";
  const isEditingWholeDiscount = 
    editingObj?.type === "purchase" &&
    editingObj?.purchaseId === purchase.id &&
    editingObj?.field === "whole_discount_value";
    /* 
  const isEditingFinalPrice = 
    editingObj?.type === "purchase" &&
    editingObj?.purchaseId === purchase.id &&
    editingObj?.field === "final_price";

  const finalPrice = useAutosaveField<number>({
    value: purchase.final_price ?? 0,
    onSave: (price) => onUpdate(purchase.id, { final_price: price }),
    isEditing: isEditingFinalPrice
  });
  Let's first not allow editing final price and calculate based on expense.
  */ 

  const location = useAutosaveField<string>({
    value: purchase.location ?? "",
    onSave: (loc) => onUpdate(purchase.id, { location: loc }),
    isEditing: isEditingLocation
  });

  const wholeDiscountValue = useAutosaveField<number>({
    value: purchase.whole_discount_value ?? 0,
    onSave: (discount) => onUpdate(purchase.id, { whole_discount_value: discount }),
    isEditing: isEditingWholeDiscount
  });


  const total =
  Number(purchase.final_price) ??
  purchase.expenses?.reduce(
    (sum: number, e: any) => sum + Number(e.price),
    0
  );

  return (
    <div className="purchase-card">
      <div className="purchase-card__header" onClick={() => setOpen((o) => !o)}>
        <InlineEdit
          value={location.draft}
          isEditing={isEditingLocation}
          placeholder="Enter Location"
          className="purchase-card__location"
          onStartEditing={() =>
            setEditingObj({
              type: "purchase",
              purchaseId: purchase.id,
              field: "location",
            })
          }
          onStopEditing={() => setEditingObj(null)}
          autosave={location}
          renderDisplay={(loc) => (
            <span className="purchase-location">
              {loc || "Untitled Purchase"}
            </span>
          )}
        />


        <div className="purchase-card__header-right">
          <span className="purchase-card__total">${total.toFixed(2)}</span>
          {/* To add whole discount input */}
          <button
            className="purchase-card__delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(purchase.id);
            }}
            aria-label="Delete purchase"
          >
            ✕
          </button>
        </div>
      </div>

      {open && (
        <div className="purchase-card__body">
          {purchase.expenses?.length === 0 ? (
            <div className="purchase-card__empty">No expenses yet</div>
          ) : (
            purchase.expenses?.map((exp: any) => (
              <div key={exp.id} className="purchase-card__expense">
                ${exp.price}
              </div>
            ))
          )}

          <div className="purchase-card__add-expense">+ Add Expense</div>
        </div>
      )}
    </div>
  );
}
