export function AddPurchaseCard({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      onClick={onAdd}
      style={{
        padding: "16px",
        marginTop: "12px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        cursor: "pointer",
        color: "#555",
        textAlign: "center",
        border: "1px dashed #ccc",
      }}
    >
      + Add Purchase
    </div>
  );
}
