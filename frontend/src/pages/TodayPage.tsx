import { DayHeader } from "../components/day/DayHeader";
import { DayPanel } from "../components/day/DayPanel";
import { usePurchasesForDate } from "../hooks/usePurchasesForDate";
import { format } from "date-fns";

// JavaScript Date object representing now- but not json, can't safely send over network as-is
const today = new Date();
// serialize the data
const isoDate = format(today, "yyyy-MM-dd");

export function TodayPage() {
  const { purchases, isLoading, isError, addPurchase, deletePurchase, updatePurchase } =
    usePurchasesForDate(isoDate);

    // Because the backend column is Numeric, SQLAlchemy + FastAPI/Pydantic serialize it as Decimal (or JSON-encode as a string) to avoid floating-point issues. When it hits the frontend, final_price isn’t a JS number by default—it’s either serialized as a string or treated as a Decimal-like value—so arithmetic yields strings unless you coerce
  const totalSpent = purchases.reduce(
    (sum, p) => sum + Number(p.final_price ?? 0),
    0
  );
  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Failed to load</div>;
  
  return (
    <>
      <DayHeader
        date={today}
        totalSpent={totalSpent}
        purchaseCount={purchases.length}
      />
      <DayPanel
        date={today}
        purchases={purchases}
        onAddPurchase={addPurchase}
        onDeletePurchase={deletePurchase}
        onUpdatePurchase={updatePurchase}
      />
    </>
  );
}

export default TodayPage
