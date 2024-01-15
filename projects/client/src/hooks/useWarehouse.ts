import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import service from "@/service";

export interface Warehouse {
  id: number;
  capacity: number;
  name: string;
  address: string;
  province: string;
  city: string;
  userId: number;
  inventoryId: number;
  warehouseAddress?: WarehouseAddressType;
}

type WarehouseAddressType = {
  id: number;
  addressDetail: string;
  cityId: string;
  provinceId: number;
  cityWarehouse?: CityType;
};

type CityType = {
  cityId: string;
  cityName: string;
  provinceId: string;
  postal_code: number;
  cityProvince: ProvinceType;
};

type ProvinceType = {
  provinceId: string;
  province: string;
};

type mutationForm = { name: string; capacity: number };

export const useGetWarehouse = (isSuperAdmin: boolean) => {
  const warehouse = useQuery<Warehouse[]>({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await service.get("/warehouses");
      return response.data.data;
    },
    enabled: isSuperAdmin,
  });
  return warehouse;
};

export const useGetWarehouseCustomer = () => {
  const warehouse = useQuery<Warehouse[]>({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await service.get("/warehouses");
      return response.data.data;
    },
  });
  return warehouse;
};

export const useGetWarehouseById = (warehouseId: string | undefined) => {
  const warehouse = useQuery<Warehouse>({
    queryKey: ["warehouse", warehouseId],
    queryFn: async () => {
      const response = await service.get(`/warehouses/${warehouseId}`);
      return response.data.data;
    },
    enabled: !!warehouseId,
  });
  return warehouse;
};

export const useGetClosestWarehouse = ({
  lat,
  lng,
}: {
  lat: number | undefined;
  lng: number | undefined;
}) => {
  const warehouse = useQuery<Warehouse>({
    queryKey: ["warehouse", lat, lng],
    queryFn: async () => {
      const response = await service.get(`/warehouses/closest/${lat}/${lng}`);
      return response.data.data;
    },
    enabled: !!lat && !!lng,
  });
  return warehouse;
};

export const useWarehouseMutation = () => {
  const queryClient = useQueryClient();
  const warehouseMutation = useMutation({
    mutationFn: async (warehouse: mutationForm) => {
      await service.post("/warehouses/post", warehouse);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    },
  });
  return warehouseMutation;
};

export const useEditWarehouse = (warehouseId: number) => {
  const queryClient = useQueryClient();
  const warehouseMutation = useMutation({
    mutationFn: async (warehouse: mutationForm) =>
      service.put(`/warehouses/put/${warehouseId}`, warehouse, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    },
  });

  return warehouseMutation;
};

export const useDeleteWarehouse = (id: number) => {
  const queryClient = useQueryClient();
  const warehouseMutation = useMutation({
    mutationFn: async () => service.delete(`/warehouses/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    },
  });

  return warehouseMutation;
};
