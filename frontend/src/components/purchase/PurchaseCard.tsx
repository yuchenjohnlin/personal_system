import { useEffect, useRef, useState } from "react";
import "./PurchaseCard.css";
import type { PurchaseUpdateDTO, PurchaseReadDTO } from "../../api/purchases";
import { useAutosaveField } from "../../hooks/useAutoSaveField";
import type { EditingTarget } from "../../types/types";
import { InlineEdit } from "../common/InlineEdit";
import { TypeToggle } from "../common/TypeToggle";
import { ExpenseList } from "../expense/ExpenseList";
import { useExpenses } from "../../hooks/useExpenses";

type PurchaseCardProps = {
  purchase: PurchaseReadDTO;
  onDeletePurchase: (id: number) => void;
  onUpdatePurchase: (id: number, payload: Partial<PurchaseUpdateDTO>) => void;
  editingObj: EditingTarget;
  setEditingObj: (id: EditingTarget) => void;
};

// purchase card opens when clicking on the card, then shows expense entries. 
// each purchase should have the amount of money spent, but that could be added afterwards
export function PurchaseCard({
  purchase,
  onDeletePurchase,
  onUpdatePurchase,
  editingObj,
  setEditingObj,
}: PurchaseCardProps) {
  const [open, setOpen] = useState(false);
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses(
    purchase.id
  );

  const isEditingLocation = 
    editingObj?.type === "purchase" &&
    editingObj?.purchaseId === purchase.id &&
    editingObj?.field === "location";
  const isEditingWholeDiscount = 
    editingObj?.type === "purchase" &&
    editingObj?.purchaseId === purchase.id &&
    editingObj?.field === "whole_discount";
    /* 
  const isEditingFinalPrice = 
    editingObj?.type === "purchase" &&
    editingObj?.purchaseId === purchase.id &&
    editingObj?.field === "final_price";

  const finalPrice = useAutosaveField<number>({
    value: purchase.final_price ?? 0,
    onSave: (price) => onUpdatePurchase(purchase.id, { final_price: price }),
    isEditing: isEditingFinalPrice
  });
  Let's first not allow editing final price and calculate based on expense.
  */ 

  // define autosave for the fields that relate to the backend
  const location = useAutosaveField<string>({
    value: purchase.location ?? "",
    onSave: (loc) => onUpdatePurchase(purchase.id, { location: loc }),
    isEditing: isEditingLocation
  });

  const wholeDiscountValue = useAutosaveField<number>({
    value: purchase.whole_discount_value ?? 0,
    onSave: (discount) => onUpdatePurchase(purchase.id, { whole_discount_value: discount }),
    isEditing: isEditingWholeDiscount
  });


  // metadata to display stats for the purchase
  const total =
  Number(purchase.final_price) ??
  (expenses.length > 0
    ? expenses.reduce((sum: number, e: any) => sum + Number(e.price), 0)
    : purchase.expenses?.reduce((sum: number, e: any) => sum + Number(e.price), 0)
  );
  const expenseCount = expenses.length || purchase.expenses?.length || 0;
  const previewText =
    expenseCount > 0 ? `${expenseCount} item${expenseCount > 1 ? "s" : ""}` : "No expenses";


  return (
    <div className="purchase-card">
      <div className="purchase-card__row">
        <div className="purchase-card__zone purchase-card__zone--left">
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
          <button
            className="purchase-card__preview-pill"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Collapse purchase" : "Expand purchase"}
          >
            <span className="purchase-card__preview">{previewText}</span>
            <span className="purchase-card__expand">{open ? "▴" : "▾"}</span>
          </button>
        </div>

        <div className="purchase-card__zone purchase-card__zone--right">
          <div className="purchase-card__summary">
            <div className="purchase-card__chip purchase-card__chip--discount">
              <span className="purchase-card__chip-label">Whole Discount</span>
              <InlineEdit
                value={wholeDiscountValue.draft}
                isEditing={isEditingWholeDiscount}
                placeholder="0"
                className="purchase-card__chip-value"
                onStartEditing={() =>
                  setEditingObj({
                    type: "purchase",
                    purchaseId: purchase.id,
                    field: "whole_discount",
                  })
                }
                onStopEditing={() => setEditingObj(null)}
                autosave={wholeDiscountValue}
                renderDisplay={(discount) => (
                  <span className="purchase-card__chip-display">
                    {discount || "—"}
                  </span>
                )}
              />
              <TypeToggle
                value={purchase.whole_discount_kind ?? "amount"}
                onChange={(next) => onUpdatePurchase(purchase.id, {whole_discount_kind: next})}
                options={[
                  { value: "amount", label: "$" },
                  { value: "percent", label: "%" },
                ]}
              />
            </div>
            <div className="purchase-card__chip purchase-card__chip--total">
              <span className="purchase-card__chip-label">Total</span>
              <span className="purchase-card__chip-value">${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="purchase-card__actions">
            <button
              className="purchase-card__delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePurchase(purchase.id);
              }}
              aria-label="Delete purchase"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="purchase-card__body">
          <ExpenseList
            expenses={expenses.length ? expenses : purchase.expenses || []}
            onAddExpense={() => addExpense()}
            onDeleteExpense={deleteExpense}
            onUpdateExpense={updateExpense}
            editingObj={editingObj}
            setEditingObj={setEditingObj}
          />
        </div>
      )}
    </div>
  );
}
