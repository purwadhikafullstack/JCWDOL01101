import { useQuery } from "@tanstack/react-query";
import service from "@/service";

export interface Categories {
  id: number;
  name: string;
  color: string;
  image: string;
  slug: string;
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

export const useFetchCategory = (slug: string | null) => {
  const categories = useQuery<Categories>({
    queryKey: ["category", slug],
    queryFn: async () => {
      const res = await service.get(`/categories/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
  });

  return categories;
};
