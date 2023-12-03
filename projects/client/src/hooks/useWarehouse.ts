import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import service from "@/service";
import { type } from "@testing-library/user-event/dist/type";


export interface Warehouse {
    id: number;
    capacity: number;
    name: string;
    address: string;
    province: string;
    city: string;
    userId: number;
}

type mutationForm = {name:string, capacity:number}

export const useGetWarehouse = ()=>{
    const warehouses = useQuery<Warehouse[]>({
        queryKey:["warehouse"],
        queryFn:async () => {
            const response = await service.get("/warehouses")
            return response.data.data
        }
    })
    return warehouses;
}

export const useFetchWarehouse = (id:number | null)=>{
  const warehouses = useQuery<Warehouse>({
    queryKey: ["warehouses",id],
    queryFn: async () => {
      const res = await service.get(`/warehouses/${id}`);
      return res.data.data;
    },
    enabled:!!id
  });

  return warehouses;
}

export const useWarehouseMutation = () =>{
    const queryClient = useQueryClient()
    const warehouseMutation = useMutation({
        mutationFn:async (warehouse:mutationForm) => {
            await service.post ("/warehouses/post",warehouse)
            
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["warehouse"]})
        }
    })
    return warehouseMutation
}


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
  