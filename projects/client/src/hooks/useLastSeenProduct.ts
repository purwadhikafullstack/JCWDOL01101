import service from "@/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "./useProduct";

interface LastSeenProduct {
  userId: number;
  productId: number;
}

export interface LastSeenProductData {
  id: number;
  userId: number;
  productId: number;
  lastSeenProduct: Product;
}

export const useGetLastSeenProduct = (
  userId: number | undefined,
  productId: number | undefined
) => {
  const query = useQuery<LastSeenProductData[]>({
    queryKey: ["last-seen-product"],
    queryFn: async () => {
      const res = await service.get(`/last-seen-product/${userId}`);
      return res.data.data;
    },
    enabled: !!userId && !!productId,
  });

  return query;
};

export const usePostLastSeenProduct = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (data: LastSeenProduct) => {
      return service.post("/last-seen-product", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["last-seen-product"] });
    },
  });

  return mutate;
};
