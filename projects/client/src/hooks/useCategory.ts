import { useQuery } from "@tanstack/react-query";
import service from "@/service";

export interface Categories {
  id: number;
  name: string;
  color: string;
}

export const useCategories = (limit?: number) => {
  const categories = useQuery<Categories[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await service.get("/categories", {
        params: {
          limit,
        },
      });
      return res.data.data;
    },
  });

  return categories;
};

export const useFetchCategory = (id: number | null) => {
  const categories = useQuery<Categories>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const res = await service.get(`/categories/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  return categories;
};
