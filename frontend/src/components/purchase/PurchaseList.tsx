import { PurchaseCard } from "./PurchaseCard";
import type { PurchaseReadDTO, PurchaseUpdateDTO } from "../../api/purchases";
import "./PurchaseList.css";
import type { EditingTarget } from "../../types/types";


export function PurchaseList({
  purchases,
  onDelete,
  onUpdate,
  editingObj,
  setEditingObj,
}: {
  purchases: PurchaseReadDTO[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, payload: PurchaseUpdateDTO) => void;
  editingObj: EditingTarget;
  setEditingObj: (id: EditingTarget) => void;
}) {
  return (
    <div className="purchase-list">
      {purchases.map((p) => (
        <PurchaseCard
          key={p.id}
          purchase={p}
          onDelete={onDelete}
          onUpdate={onUpdate}
          editingObj={editingObj}
          setEditingObj={setEditingObj}
        />
      ))}
    </div>
  );
}

export default PurchaseList
