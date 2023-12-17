import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { Warehouse } from "./useWarehouse";
export interface Inventory {
  id?: number;
  warehouseId?: number;
  productId?: number;
  stock: number;
  sold: number;
  warehouse: Warehouse;
}

export const useWarehouse = (productId: number, warehouseId: number) => {
  const { data, isLoading } = useQuery<Inventory[]>({
    queryKey: ["warehouse", productId, warehouseId],
    queryFn: async () => {
      const res = await service.get('/inventory/warehouse', {
        params: { productId, warehouseId }
      });
      return res.data.data;
    },
    enabled: productId > 0 && !!warehouseId,
  });

  return { data, isLoading };
};