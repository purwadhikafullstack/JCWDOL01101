import { useMutation, useQueryClient } from "@tanstack/react-query";
import service from "@/service";

type CategoryData = {
  id?: number;
  data: FormData;
};

export const useCategoryMutation = () => {
  const queryClient = useQueryClient();
  const category = useMutation({
    mutationFn: async (data: FormData) => {
      return service.post("/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return category;
};

export const useEditCategoryMutation = (slug: string) => {
  const queryClient = useQueryClient();
  const category = useMutation({
    mutationFn: async ({ id, data }: CategoryData) => {
      return service.put(`/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return category;
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const category = useMutation({
    mutationFn: async (id: number) => {
      return service.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return category;
};
