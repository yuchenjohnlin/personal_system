import { PurchaseCard } from "./PurchaseCard";
import { AddPurchaseCard } from "./AddPurchaseCard";
import "./PurchaseList.css";

export function PurchaseList({
  purchases,
  onAddPurchase,
}: {
  purchases: any[];
  onAddPurchase: () => void;
}) {
  return (
    <div className="purchase-list">
      {purchases.map((p) => (
        <PurchaseCard key={p.id} purchase={p} />
      ))}

      <AddPurchaseCard onAdd={onAddPurchase} />
    </div>
  );
}

export default PurchaseList