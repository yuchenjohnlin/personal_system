import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  fetchExpensesForPurchase,
  updateExpense,
  type ExpenseCreateDTO,
  type ExpenseReadDTO,
  type ExpenseUpdateDTO,
} from "../api/expenses";

/**
  Hook for CRUD on expenses tied to a specific purchase.
  Supply a purchaseId to fetch its expenses and to scope mutations.
*/
export function useExpenses(purchaseId?: number) {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: ["expenses", purchaseId],
    queryFn: () => fetchExpensesForPurchase(purchaseId!),
    enabled: !!purchaseId,
  });

  const createExpenseMutation = useMutation({
    mutationFn: (vars: { purchaseId: number; payload: ExpenseCreateDTO }) =>
      createExpense(vars.purchaseId, vars.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", purchaseId] });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: (vars: { id: number; payload: ExpenseUpdateDTO }) =>
      updateExpense(vars.id, vars.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", purchaseId] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: number) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", purchaseId] });
    },
  });

  const addExpense = (payload: Partial<ExpenseCreateDTO> = {}) => {
    if (!purchaseId) return;
    createExpenseMutation.mutate({
      purchaseId,
      payload,
    });
  };

  const updateExpenseForPurchase = (id: number, payload: ExpenseUpdateDTO) =>
    updateExpenseMutation.mutate({ id, payload });

  const removeExpense = (id: number) => deleteExpenseMutation.mutate(id);

  return {
    expenses: (expensesQuery.data as ExpenseReadDTO[]) ?? [],
    isLoading: expensesQuery.isLoading,
    isError: expensesQuery.isError,
    addExpense,
    updateExpense: updateExpenseForPurchase,
    deleteExpense: removeExpense,
  };
}
