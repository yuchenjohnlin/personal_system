import type { UnitType, ValueType } from "../types/types";

export type ProductNameDTO = {
  id: number;
  name: string;
};

export type ProductDTO = {
  id: number;
  product_name_id?: number;
  product_name?: ProductNameDTO;
  item_id?: number;
  category_id?: number;
};

export type ExpenseCreateDTO = {
  price?: number | null;
  user_label?: string | null;
  tax_value?: number | null;
  tax_kind?: ValueType | null;
  tip_value?: number | null;
  tip_kind?: ValueType | null;
  product_id?: number | null;
  // detail intentionally omitted for now
};

export type ExpenseUpdateDTO = Partial<ExpenseCreateDTO>;

export type ExpenseReadDTO = {
  id: number;
  purchase_id: number;
  price: number | null;
  user_label?: string | null;
  tax_value?: number | null;
  tax_kind?: ValueType | null;
  tip_value?: number | null;
  tip_kind?: ValueType | null;
  product_id?: number | null;
  product?: ProductDTO;
  // detail fields can be added when needed
};

export async function fetchExpensesForPurchase(purchaseId: number) {
  const res = await fetch(`http://localhost:8000/expenses?purchase_id=${purchaseId}`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json() as Promise<ExpenseReadDTO[]>;
}

export async function createExpense(purchaseId: number, payload: ExpenseCreateDTO) {
  const res = await fetch(`http://localhost:8000/expenses/${purchaseId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create expense");
  return res.json() as Promise<ExpenseReadDTO>;
}

export async function updateExpense(id: number, payload: ExpenseUpdateDTO) {
  const res = await fetch(`http://localhost:8000/expenses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update expense");
  return res.json() as Promise<ExpenseReadDTO>;
}

export async function deleteExpense(id: number) {
  const res = await fetch(`http://localhost:8000/expenses/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json() as Promise<{ success: boolean }>;
}
