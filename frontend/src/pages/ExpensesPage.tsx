import { useMemo, useState } from "react";
import PurchaseList from "../components/PurchaseList";
import "./ExpensesPage.css";

type Expense = {
  id: number;
  user_label: string;
  price: number;
  tax_value?: number;
  tip_value?: number;
};

type Purchase = {
  id: number;
  location: string;
  purchased_at: string;
  final_price: number;
  expenses: Expense[];
};

const mockPurchases: Purchase[] = [
  {
    id: 1,
    location: "Grocery Store",
    purchased_at: "2024-12-01",
    final_price: 82.5,
    expenses: [
      { id: 11, user_label: "Produce", price: 32.5, tax_value: 2.1 },
      { id: 12, user_label: "Snacks", price: 50, tax_value: 3.25 },
    ],
  },
  {
    id: 2,
    location: "Coffee Shop",
    purchased_at: "2024-12-02",
    final_price: 12.75,
    expenses: [{ id: 21, user_label: "Latte", price: 6.5, tip_value: 1.5 }],
  },
];

function ExpensesPage() {
  const [query, setQuery] = useState("");

  const filteredPurchases = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return mockPurchases;
    return mockPurchases.filter(
      (purchase) =>
        purchase.location.toLowerCase().includes(normalized) ||
        purchase.expenses.some((exp) => exp.user_label.toLowerCase().includes(normalized))
    );
  }, [query]);

  return (
    <div className="expenses">
      <header className="expenses__header">
        <div className="expenses__copy">
          <h1>Expenses</h1>
          <p>View and capture purchases, with tax/tip breakdowns per line item.</p>
        </div>
        <input
          className="expenses__search"
          type="search"
          placeholder="Search by location or label..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <PurchaseList purchases={filteredPurchases} onAddPurchase={() => {}} />
    </div>
  );
}

export default ExpensesPage;
