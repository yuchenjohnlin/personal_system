import { format } from "date-fns";
import "./DayPanel.css";

import { AddPurchaseCard } from "../purchase/AddPurchaseCard";
import { PurchaseList } from "../purchase/PurchaseList";
import type { PurchaseReadDTO, PurchaseCreateDTO, PurchaseUpdateDTO } from "../../api/purchases";
import { useState, useEffect } from "react";

type DayPanelProps = {
  date: Date;
  // Pass the already-fetched purchases for this date; keep query logic in hooks/parents
  purchases: PurchaseReadDTO[];
  onAddPurchase: (payload?: Partial<PurchaseCreateDTO>) => void;
  onDeletePurchase: (id: number) => void;
  onUpdatePurchase: (id: number, payload: Partial<PurchaseUpdateDTO>) => void;
};

export function DayPanel({
  date,
  purchases,
  onAddPurchase,
  onDeletePurchase,
  onUpdatePurchase
}: DayPanelProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  // if don't add the focus new the onblur kind of fights with the newly created autofocuse in the useEffect
  const [focusNewPurchase, setFocusNewPurchase] = useState(false);

  // Focus a newly added purchase once; avoid re-triggering while it's still blank
  useEffect(() => {
    if (!focusNewPurchase) return;
    const unnamed = purchases.find((p) => !p.location); // find the new added purchase where location is empty "" or null
    if (unnamed) {
      setEditingId(unnamed.id);
      setFocusNewPurchase(false);
    }
  }, [purchases]);

  const handleAddPurchase = () => {
    onAddPurchase({
      purchased_at: format(date, "yyyy-MM-dd"),
    });
    setEditingId(null);
    // when we add a new purchase we focus it.
    setFocusNewPurchase(true);
  };

  return (
    <section className="day-panel">
      <div className="day-panel__content">
        {purchases.length === 0 ? (
          <>
          </>
        ) : (
          <PurchaseList
            purchases={purchases}
            onDelete={onDeletePurchase}
            onUpdate={onUpdatePurchase}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        )}
        <AddPurchaseCard onAdd={handleAddPurchase} disabled={editingId !== null} />
      </div>
    </section>
  );
}
// not sure if the disabled is needed because I think it works without it.
// if I have the disabled, then when the onStopEditing is not used 
// the editingID is not set to null and then I can't add a new purchase, because the hook didn't have the onStopeEditing at first.
// but if you remove the disabled it doesn't seem to have a large problem. but it doesn't finish the edit function properly I guess
// so we still need the stopEditing to set it to null, which is done by overriding the bind in the purchase card