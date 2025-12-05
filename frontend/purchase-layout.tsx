import React from "react";

/**
 * Minimal purchase entry layout (no autosave yet).
 * Wire real state and handlers later.
 */
export function PurchaseLayout() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>New Purchase</h1>
        <p style={{ color: "#555", marginTop: 8 }}>
          Enter purchase info and line items. Autosave can be wired next.
        </p>
      </header>

      <section
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Purchase Info</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <LabeledInput label="Store / Location">
            <input type="text" placeholder="Costco" />
          </LabeledInput>
          <LabeledInput label="Date / Time">
            <input type="datetime-local" />
          </LabeledInput>
          <LabeledInput label="Whole Discount">
            <input type="number" step="0.01" placeholder="e.g. 5.00" />
          </LabeledInput>
          <LabeledInput label="Final Price (after tax/tip)">
            <input type="number" step="0.01" placeholder="e.g. 82.45" />
          </LabeledInput>
          <LabeledInput label="Receipt URL (optional)" fullWidth>
            <input type="url" placeholder="https://..." />
          </LabeledInput>
        </div>
      </section>

      <section
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Line Items</h2>
          <button type="button">+ Add Line</button>
        </header>
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <LineItemCard index={1} />
          {/* Duplicate <LineItemCard> for additional rows or map over data later */}
        </div>
      </section>

      <footer style={{ display: "flex", gap: 8 }}>
        <button type="button">Save</button>
        <button type="button">Cancel</button>
      </footer>
    </div>
  );
}

function LabeledInput({
  label,
  children,
  fullWidth = false,
}: {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

function LineItemCard({ index }: { index: number }) {
  return (
    <div
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: 12,
        display: "grid",
        gap: 8,
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      }}
    >
      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8 }}>
        <strong>Line #{index}</strong>
        <button type="button" style={{ marginLeft: "auto" }}>
          Remove
        </button>
      </div>
      <LabeledInput label="Label / Alias">
        <input type="text" placeholder="Milk 2gal" />
      </LabeledInput>
      <LabeledInput label="Category">
        <input type="text" placeholder="Grocery" />
      </LabeledInput>
      <LabeledInput label="Quantity">
        <input type="number" step="0.01" placeholder="1" />
      </LabeledInput>
      <LabeledInput label="Unit Price">
        <input type="number" step="0.01" placeholder="5.99" />
      </LabeledInput>
      <LabeledInput label="Discount">
        <input type="number" step="0.01" placeholder="0.50 or 0.1 for 10%" />
      </LabeledInput>
      <LabeledInput label="Tax">
        <input type="number" step="0.01" placeholder="0.50" />
      </LabeledInput>
      <LabeledInput label="Tip">
        <input type="number" step="0.01" placeholder="0.00" />
      </LabeledInput>
      <LabeledInput label="Line Total">
        <input type="number" step="0.01" placeholder="6.49" />
      </LabeledInput>
    </div>
  );
}
