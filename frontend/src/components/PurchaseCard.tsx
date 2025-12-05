import { useState } from "react";

export function PurchaseCard({ purchase }: { purchase: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "white",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {/* header */}
      <div
        style={{ cursor: "pointer", fontWeight: 600 }}
        onClick={() => setOpen(!open)}
      >
        {purchase.location || "Untitled Purchase"}
      </div>

      {/* collapse body */}
      {open && (
        <div style={{ marginTop: "12px" }}>
          {purchase.expenses.length === 0 ? (
            <div style={{ color: "#777" }}>No expenses yet</div>
          ) : (
            purchase.expenses.map((exp: any) => (
              <div
                key={exp.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                ${exp.price}
              </div>
            ))
          )}

          <div
            style={{
              marginTop: "8px",
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "6px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            + Add Expense
          </div>
        </div>
      )}
    </div>
  );
}
