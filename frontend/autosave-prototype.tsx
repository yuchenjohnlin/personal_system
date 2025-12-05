import React, { useCallback, useEffect, useRef, useState } from "react";

type SaveState = "idle" | "saving" | "saved" | "error";

type PurchasePatch = Partial<{
  location: string;
  purchased_at: string;
  whole_discount_value: number;
  final_price: number;
  receipt: string;
}>;

type ExpensePatch = Partial<{
  price: number;
  quantity: number;
  tax_value: number;
  tip_value: number;
  discount_value: number;
  user_label: string;
  category_id: number | null;
  product_id: number | null;
}>;

function useDebouncedPatch<TPatch extends Record<string, unknown>>(opts: {
  url: string;
  delayMs?: number;
}) {
  const { url, delayMs = 600 } = opts;
  const timer = useRef<number | null>(null);
  const latestPatch = useRef<TPatch | null>(null);
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  const flush = useCallback(async () => {
    if (!latestPatch.current) return;
    const payload = latestPatch.current;
    latestPatch.current = null;
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    setState("saving");
    setError(null);
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState("saved");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [url]);

  const queue = useCallback(
    (patch: TPatch) => {
      latestPatch.current = { ...(latestPatch.current ?? {}), ...patch };
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, delayMs);
      setState("saving");
    },
    [delayMs, flush]
  );

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return { queue, flush, state, error };
}

export function PurchaseEditor({
  purchaseId,
  initial,
}: {
  purchaseId: number;
  initial: {
    location: string;
    purchased_at: string;
    final_price: number;
    expenses: Array<{
      id: number;
      user_label: string;
      price: number;
      tax_value: number | null;
      tip_value: number | null;
    }>;
  };
}) {
  const [purchase, setPurchase] = useState(initial);
  const purchaseSaver = useDebouncedPatch<PurchasePatch>({
    url: `/api/purchases/${purchaseId}`,
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section>
        <h2>Purchase</h2>
        <label>
          Location
          <input
            value={purchase.location}
            onChange={(e) => {
              const location = e.target.value;
              setPurchase((p) => ({ ...p, location }));
              purchaseSaver.queue({ location });
            }}
            onBlur={() => purchaseSaver.flush()}
          />
        </label>
        <label>
          Purchased at
          <input
            type="datetime-local"
            value={purchase.purchased_at}
            onChange={(e) => {
              const purchased_at = e.target.value;
              setPurchase((p) => ({ ...p, purchased_at }));
              purchaseSaver.queue({ purchased_at });
            }}
            onBlur={() => purchaseSaver.flush()}
          />
        </label>
        <label>
          Final price
          <input
            type="number"
            step="0.01"
            value={purchase.final_price}
            onChange={(e) => {
              const final_price = parseFloat(e.target.value);
              setPurchase((p) => ({ ...p, final_price }));
              purchaseSaver.queue({ final_price });
            }}
            onBlur={() => purchaseSaver.flush()}
          />
        </label>
        <SaveStatus state={purchaseSaver.state} error={purchaseSaver.error} />
      </section>

      <section>
        <h2>Expenses</h2>
        {purchase.expenses.map((exp, idx) => (
          <ExpenseRow
            key={exp.id}
            idx={idx}
            expense={exp}
            onChange={(updated) =>
              setPurchase((p) => ({
                ...p,
                expenses: p.expenses.map((row) =>
                  row.id === updated.id ? updated : row
                ),
              }))
            }
          />
        ))}
      </section>
    </div>
  );
}

function ExpenseRow({
  idx,
  expense,
  onChange,
}: {
  idx: number;
  expense: {
    id: number;
    user_label: string;
    price: number;
    tax_value: number | null;
    tip_value: number | null;
  };
  onChange: (next: ExpensePatch & { id: number }) => void;
}) {
  const saver = useDebouncedPatch<ExpensePatch>({
    url: `/api/expenses/${expense.id}`,
  });

  return (
    <div style={{ border: "1px solid #ddd", padding: 12 }}>
      <div>Line #{idx + 1}</div>
      <label>
        Label
        <input
          value={expense.user_label}
          onChange={(e) => {
            const user_label = e.target.value;
            onChange({ ...expense, user_label });
            saver.queue({ user_label });
          }}
          onBlur={() => saver.flush()}
        />
      </label>
      <label>
        Price
        <input
          type="number"
          step="0.01"
          value={expense.price}
          onChange={(e) => {
            const price = parseFloat(e.target.value);
            onChange({ ...expense, price });
            saver.queue({ price });
          }}
          onBlur={() => saver.flush()}
        />
      </label>
      <label>
        Tax
        <input
          type="number"
          step="0.01"
          value={expense.tax_value ?? ""}
          onChange={(e) => {
            const tax_value = e.target.value
              ? parseFloat(e.target.value)
              : null;
            onChange({ ...expense, tax_value });
            saver.queue({ tax_value: tax_value ?? undefined });
          }}
          onBlur={() => saver.flush()}
        />
      </label>
      <label>
        Tip
        <input
          type="number"
          step="0.01"
          value={expense.tip_value ?? ""}
          onChange={(e) => {
            const tip_value = e.target.value
              ? parseFloat(e.target.value)
              : null;
            onChange({ ...expense, tip_value });
            saver.queue({ tip_value: tip_value ?? undefined });
          }}
          onBlur={() => saver.flush()}
        />
      </label>
      <SaveStatus state={saver.state} error={saver.error} />
    </div>
  );
}

function SaveStatus({ state, error }: { state: SaveState; error: string | null }) {
  if (state === "saving") return <small>Saving…</small>;
  if (state === "saved") return <small style={{ color: "green" }}>Saved</small>;
  if (state === "error")
    return (
      <small style={{ color: "red" }}>
        Failed to save{error ? `: ${error}` : ""}
      </small>
    );
  return null;
}
