import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Inventory, Product } from "./useProduct";

type ProductOptions = {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
  size: string;
  warehouse: string;
  category: string;
};
export const useInventory = ({
  s,
  page,
  size,
  filter,
  order,
  limit,
  category,
  warehouse,
}: ProductOptions) => {
  const { getToken } = useAuth();
  const data = useQuery<{
    inventories: Inventory[];
    totalPages: number;
  }>({
    queryKey: ["inventory", page, s, filter, order, warehouse, category, size],
    queryFn: async () => {
      const res = await service.get("/inventory", {
        params: {
          s,
          size,
          page,
          order,
          limit,
          filter,
          category,
          warehouse,
        },
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
  });

  return data;
};
