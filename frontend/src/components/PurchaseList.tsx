import { PurchaseCard } from "./PurchaseCard";
import { AddPurchaseCard } from "./AddPurchaseCard";

export function PurchaseList({
  purchases,
  onAddPurchase,
}: {
  purchases: any[];
  onAddPurchase: () => void;
}) {
  return (
    <div>
      {purchases.map((p) => (
        <PurchaseCard key={p.id} purchase={p} />
      ))}

      <AddPurchaseCard onAdd={onAddPurchase} />
    </div>
  );
}
