import { useToast } from "@/components/ui/use-toast";
import service from "@/service";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useProductMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const productMutation = useMutation({
    mutationFn: async (product: FormData) => {
      await service.post("/products", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Opps!, Something went Wrong",
          description: error.response?.data.message,
          variant: "destructive",
        });
      }
    },
  });

  return { productMutation };
};

export const useEditProduct = (slug: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async (product: FormData) =>
      service.put(`/products/${slug}`, product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Opps!, Something went Wrong",
          description: error.response?.data.message,
          variant: "destructive",
        });
      }
    },
  });

  return productMutation;
};

export const useDeleteProduct = (productId: number) => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async () => service.patch(`/products/delete/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return productMutation;
};

export const useDeleteProductImage = (imageId: number, slug?: string) => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async () => service.delete(`/products/images/${imageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
    },
  });

  return productMutation;
};
