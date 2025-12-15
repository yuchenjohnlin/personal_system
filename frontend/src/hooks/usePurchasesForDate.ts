import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPurchasesForDate,
  createPurchase,
  deletePurchase,
  updatePurchase,
  type PurchaseCreateDTO,
  type PurchaseReadDTO,
  type PurchaseUpdateDTO,
} from "../api/purchases";

export function usePurchasesForDate(date: string) {
  const queryClient = useQueryClient();

  const purchasesQuery = useQuery({
    queryKey: ["purchases", date],
    queryFn: () => fetchPurchasesForDate(date),
  });

  const createPurchaseMutation = useMutation({
    mutationFn: (payload: PurchaseCreateDTO) => createPurchase(payload),
    onSuccess: () => {
      // refetch purchases for this date
      console.log("create successful")

      queryClient.invalidateQueries({
        queryKey: ["purchases", date],
      });
    },
  });

  const deletePurchaseMutation = useMutation({
    mutationFn: (id: number) => deletePurchase(id),
    onSuccess: () => {
      console.log("delete successful")
      queryClient.invalidateQueries({
        queryKey: ["purchases", date],
      });
    },
  });

  const updatePurchaseMutation = useMutation({
    mutationFn: (vars: { id: number; payload: PurchaseUpdateDTO }) =>
      updatePurchase(vars.id, vars.payload),
    onSuccess: () => {
      console.log("update successful")

      queryClient.invalidateQueries({
        queryKey: ["purchases", date],
      });
    },
  });

  return {
    purchases: purchasesQuery.data ?? [],
    isLoading: purchasesQuery.isLoading,
    isError: purchasesQuery.isError,

    // Provide the date by default so callers don't forget it
    addPurchase: (payload: Partial<PurchaseCreateDTO> = {}) =>
      createPurchaseMutation.mutate({
        purchased_at: date,
        ...payload,
      }),
    updatePurchase: (id: number, payload: PurchaseUpdateDTO) =>
      updatePurchaseMutation.mutate({ id, payload }),
    deletePurchase: deletePurchaseMutation.mutate,
  };
}
