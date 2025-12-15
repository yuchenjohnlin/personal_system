import { useEffect, useRef, useState } from "react";
import "./PurchaseCard.css";
import { debounce } from "lodash-es"; // or hand-roll
import type { PurchaseUpdateDTO } from "../../api/purchases";


// purchase card opens when clicking on the card, then shows expense entries. 
// each purchase should have the amount of money spent, but that could be added afterwards
export function PurchaseCard({
  purchase,
  onDelete,
  onUpdate,
  isEditing,
  onStartEditing,
  onStopEditing,
}: {
  purchase: any;
  onDelete: (id: number) => void;
  onUpdate: (id: number, payload: Partial<PurchaseUpdateDTO>) => void;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftLocation, setDraftLocation] = useState(purchase.location ?? "");

  // debounce save to avoid spamming API
  const debouncedSave = useRef(
    debounce((loc: string) => onUpdate(purchase.id, { location: loc }), 400)
  ).current;

  useEffect(() => {
    debouncedSave(draftLocation);
    return () => debouncedSave.cancel();
  }, [draftLocation, debouncedSave]);

  // autofocus when entering edit mode
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  // keep local state in sync with prop changes (e.g., after refetch) without forcing edit state changes
  useEffect(() => {
    if (!isEditing)
      setDraftLocation(purchase.location ?? "");
  }, [purchase.id, purchase.location]);

  const total =
  Number(purchase.final_price) ??
  purchase.expenses.reduce(
    (sum: number, e: any) => sum + Number(e.price),
    0
  );

  return (
    <div className="purchase-card">
      <div className="purchase-card__header" onClick={() => setOpen((o) => !o)}>
        {isEditing ? (
          <input
            ref={inputRef}
            className="purchase-card__location-input"
            placeholder="Enter location"
            value={draftLocation}
            onChange={(e) => setDraftLocation(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => {
              debouncedSave.flush(); // save immediately on blur
              onStopEditing();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                debouncedSave.flush();
                onStopEditing();
              }
              if (e.key === "Escape") {
                setDraftLocation(purchase.location ?? "");
                onStopEditing();
              }
            }}
          />
        ) : (
          <span
            className="purchase-card__location"
            onClick={(e) => {
              // so because this thing is still under the header of purchase card header so when you click this you are clicking both the location and the header, 
              // so the it will be triggered twice. So we use the stopPropagation to stop this.
              e.stopPropagation();
              onStartEditing();
            }}
          >
            {draftLocation || "Untitled Purchase"}
          </span>
        )}

        <div className="purchase-card__header-right">
          <span className="purchase-card__total">${total.toFixed(2)}</span>
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
          {purchase.expenses.length === 0 ? (
            <div className="purchase-card__empty">No expenses yet</div>
          ) : (
            purchase.expenses.map((exp: any) => (
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
