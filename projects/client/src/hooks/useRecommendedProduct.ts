import service from "@/service";
import { useQuery } from "@tanstack/react-query";
import { Product } from "./useProduct";

export const useRecommendedProduct = (userId: number | undefined) => {
  const query = useQuery<Product[]>({
    queryKey: ["recommendedProduct"],
    queryFn: async () => {
      const res = await service.get(`/recommendation/${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

  return query;
};
