import "./AddPurchaseCard.css";

export function AddPurchaseCard({ onAdd }: { onAdd: () => void }) {
  return (
    <button className="add-purchase" onClick={onAdd}>
        + Add Purchase
    </button>
  );
}
