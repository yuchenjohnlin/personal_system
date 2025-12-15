import type { ValueType } from "../types/types";

export type PurchaseCreateDTO = {
  location?: string;
  purchased_at: string;
  whole_discount_value?: number;
  whole_discount_kind?: ValueType;
};

export type PurchaseUpdateDTO = {
  // seems like we still need to add ? 
  location?: string;
  purchased_at?: string;
  whole_discount_value?: number;
  whole_discount_kind?: ValueType;
};

export type PurchaseReadDTO = {
  id: number;
  location: string;
  purchased_at: string;
  final_price: number;
  whole_discount_value?: number;
  whole_discount_kind?: ValueType;
  expenses?: { id: number; price: number }[];
};


export async function fetchPurchasesForDate(date: string) {
  const res = await fetch(`http://localhost:8000/purchases?date=${date}`, {
    // credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch purchases");
  }

  return res.json() as Promise<PurchaseReadDTO[]>;
}

export async function createPurchase(payload: PurchaseCreateDTO) {
  const res = await fetch("http://localhost:8000/purchases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create purchase");
  }

  return res.json();
}

export async function updatePurchase(id: number, payload: Partial<PurchaseUpdateDTO>) {
  const res = await fetch(`http://localhost:8000/purchases/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update purchase");
  return res.json();
}

export async function deletePurchase(id: number) {
  const res = await fetch(`http://localhost:8000/purchases/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete purchase");
  }

  return res.json();
}
