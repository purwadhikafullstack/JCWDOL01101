import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { Inventory } from "./useProduct";
import Hashids from "hashids";

export const useWarehouse = (
  sizeId: number | undefined,
  productId: number,
  warehouseId: number | undefined
) => {
  const { data, isLoading } = useQuery<Inventory[]>({
    queryKey: ["inventory", sizeId, productId, warehouseId],
    queryFn: async () => {
      const res = await service.get(
        `/inventories/warehouse/${warehouseId}/product/${productId}/size/${sizeId}`
      );
      return res.data.data;
    },
    enabled: !!productId && !!warehouseId && !!sizeId,
  });
  return { data, isLoading };
};

export const useInventoryByWarehouseId = (
  productId: number | undefined,
  warehouseId: string | undefined
) => {
  const hashids = new Hashids("TOTEN", 10);
  let decodeWarehouseId: number | string | undefined = warehouseId;
  if (decodeWarehouseId) {
    decodeWarehouseId = Number(hashids.decode(decodeWarehouseId));
  }
  const inventory = useQuery<Inventory[]>({
    queryKey: ["inventory", warehouseId, productId],
    queryFn: async () => {
      const res = await service.get(
        `/inventories/warehouse/${decodeWarehouseId}/product/${productId}`
      );
      return res.data.data;
    },
    enabled: !!productId && !!warehouseId,
  });

  return inventory;
};


export const useGetInventory = (isSuperAdmin: boolean) => {
  const inventory = useQuery<Inventory[]>({
    queryKey: ["inventories"],
    queryFn: async () => {
      const response = await service.get("/inventories");
      return response.data.data;
    },
    enabled: isSuperAdmin,
  });
  return inventory;
};