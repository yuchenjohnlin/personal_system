export type ValueType = "amount" | "percent";
export type UnitType = "weight" | "count";
export type EditingTarget = 
    | { type: "purchase"; purchaseId: number; field: "location" | "whole_discount_value" }
    | {type: "expense"; expenseId: number; field: "price"}
    | null;