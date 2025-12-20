import { PurchaseCard } from "./PurchaseCard";
import type { PurchaseReadDTO, PurchaseUpdateDTO } from "../../api/purchases";
import "./PurchaseList.css";
import type { EditingTarget } from "../../types/types";


export function PurchaseList({
  purchases,
  onDeletePurchase,
  onUpdatePurchase,
  editingObj,
  setEditingObj,
}: {
  purchases: PurchaseReadDTO[];
  onDeletePurchase: (id: number) => void;
  onUpdatePurchase: (id: number, payload: PurchaseUpdateDTO) => void;
  
  editingObj: EditingTarget;
  setEditingObj: (id: EditingTarget) => void;
}) {
  return (
    <div className="purchase-list">
      <div className="purchase-list__header">
        <span>Purchase</span>
        <span>Whole Discount / Total</span>
      </div>
      {purchases.map((p) => (
        <PurchaseCard
          key={p.id}
          purchase={p}
          onDeletePurchase={onDeletePurchase}
          onUpdatePurchase={onUpdatePurchase}
          editingObj={editingObj}
          setEditingObj={setEditingObj}
        />
      ))}
    </div>
  );
}

export default PurchaseList
