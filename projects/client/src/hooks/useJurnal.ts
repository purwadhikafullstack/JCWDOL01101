import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@tanstack/react-query";

type InventoryType = {
    inventoryId: number;
    warehouse: WarehouseType;
    sizes: SizeType;
    status: string;
    product: ProductType;
    stock: number;
    sold: number;
  };
  
  type WarehouseType = {
    warehouseId: number;
    name: string;
  };
  
  type SizeType = {
    sizeId: number;
    label: string;
    value: number;
  };
  
  type ProductType = {
    productId: number;
    name: string;
  };

export interface Jurnal {
  id: number;
  inventoryId: number;
  oldQty: number;
  qtyChange: number;
  newQty: number;
  type: "1" | "0";
  notes: string;
  createdAt:string;
  jurnal?:InventoryType;
}


export const useGetJurnal = (isSuperAdmin: boolean) => {
    const jurnal = useQuery<Jurnal[]>({
      queryKey: ["jurnals"],
      queryFn: async () => {
        const response = await service.get("/jurnals");
        return response.data.data;
      },
      enabled: isSuperAdmin,
    });
    return jurnal;
  };

type jurnalOptions = {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
  warehouse: string;
  product: string;
  size: string;

};

export const useGetAllJurnals = ({
  page,
    s,
    order,
    limit,
    filter,
    warehouse,
    product,
    size,
}: jurnalOptions) => {
  const { getToken } = useAuth();
  const { data, isLoading, isFetched } = useQuery<{
    jurnals: Jurnal[];
    totalPages: number;
  }>({
    queryKey: ["jurnals", page, s, filter, order, warehouse, product,size],
    queryFn: async () => {
      const res = await service.get("/jurnals", {
        params: {
          s,
          page,
          order,
          limit,
          filter,
          warehouse,
          product,
          size,
        },
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
  });

  return { data, isLoading, isFetched };
};
