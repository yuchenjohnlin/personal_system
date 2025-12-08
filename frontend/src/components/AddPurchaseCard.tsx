import "./AddPurchaseCard.css";

export function AddPurchaseCard({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="add-purchase" onClick={onAdd} role="button" tabIndex={0}>
      + Add Purchase
    </div>
  );
}
