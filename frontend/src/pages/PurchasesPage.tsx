import { useState } from "react";
import { PurchaseList } from "../components/PurchaseList";

export function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);

  function addPurchase() {
    const newPurchase = {
      id: Date.now(),
      location: "",
      expenses: [],
    };
    setPurchases([...purchases, newPurchase]);
  }

  return (
    <div>
      <h1 style={{ marginBottom: "16px" }}>Purchases</h1>
      <PurchaseList purchases={purchases} onAddPurchase={addPurchase} />
    </div>
  );
}
