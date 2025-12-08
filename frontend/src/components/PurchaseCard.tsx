import { useState } from "react";
import "./PurchaseCard.css";

export function PurchaseCard({ purchase }: { purchase: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="purchase-card">
      <div className="purchase-card__header" onClick={() => setOpen(!open)}>
        {purchase.location || "Untitled Purchase"}
      </div>

      {open && (
        <div className="purchase-card__body">
          {purchase.expenses.length === 0 ? (
            <div className="purchase-card__empty">No expenses yet</div>
          ) : (
            purchase.expenses.map((exp: any) => (
              <div key={exp.id} className="purchase-card__expense">
                ${exp.price}
              </div>
            ))
          )}

          <div className="purchase-card__add-expense">+ Add Expense</div>
        </div>
      )}
    </div>
  );
}
