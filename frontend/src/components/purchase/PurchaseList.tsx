import { PurchaseCard } from "./PurchaseCard";
import type { PurchaseReadDTO, PurchaseUpdateDTO } from "../../api/purchases";
import "./PurchaseList.css";


export function PurchaseList({
  purchases,
  onDelete,
  onUpdate,
  editingId,
  setEditingId,
}: {
  purchases: PurchaseReadDTO[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, payload: PurchaseUpdateDTO) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
}) {
  return (
    <div className="purchase-list">
      {purchases.map((p) => (
        <PurchaseCard
          key={p.id}
          purchase={p}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isEditing={editingId === p.id}
          // for each purchase card, 
          onStartEditing={() => setEditingId(p.id)}
          onStopEditing={() => setEditingId(null)}
        />
      ))}
    </div>
  );
}

export default PurchaseList
