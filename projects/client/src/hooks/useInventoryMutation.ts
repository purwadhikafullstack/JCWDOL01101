import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type StockData = {
  stock: number;
  notes: string | undefined;
  sizeId: number;
  warehouseId: number;
  productId: number;
};
export const useInventoryMutation = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (data: StockData) => {
      return service.put("/inventories/modify-stock", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return mutate;
};
