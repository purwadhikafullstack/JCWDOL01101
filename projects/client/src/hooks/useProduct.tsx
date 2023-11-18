import service from "@/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Product {
  id?: number;
  categoryId: number;
  name: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
  weight: number;
  description: string;
  status: string;
}

type ProductOptions = {
  page: number;
  s: string;
};
export const useProducts = ({ page, s }: ProductOptions) => {
  const { data, isLoading, isFetched } = useQuery<{
    products: Product[];
    totalPages: number;
  }>({
    queryKey: ["products", page, s],
    queryFn: async () => {
      const res = await service.get("/products", {
        params: {
          s,
          page,
        },
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  return { data, isLoading, isFetched };
};

export const useProduct = (productId: number) => {
  const { data, isLoading } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await service.get(`/product/${productId}`, {
        withCredentials: true,
      });
      return res.data.data;
    },
    enabled: !!productId,
  });

  return { data, isLoading };
};

export const useProductMutation = () => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async (product: FormData) =>
      service.post("/product", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return productMutation;
};

export const useEditProduct = (productId: number) => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async (product: FormData) =>
      service.put(`/product/${productId}`, product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });

  return productMutation;
};

export const useDeleteProduct = (productId: number) => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async () => service.put(`/product/delete/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return productMutation;
};
