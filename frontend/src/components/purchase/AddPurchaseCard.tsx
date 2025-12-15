import "./AddPurchaseCard.css";

type AddPurchaseCardProps = {
  onAdd: () => void;
  disabled?: boolean;
};

export function AddPurchaseCard({ onAdd, disabled }: AddPurchaseCardProps) {
  return (
    <button className="add-purchase" onClick={onAdd} disabled={disabled}>
      + Add Purchase
    </button>
  );
}
