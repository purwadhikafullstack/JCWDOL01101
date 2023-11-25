import service from "@/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

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

type ProductUrlOptions = {
  key: string;
  url: string;
};

export const useProductUrl = ({ key, url }: ProductUrlOptions) => {
  const { data, isLoading, isFetched } = useQuery<Product[]>({
    queryKey: [key],
    queryFn: async () => {
      const res = await service.get(url, {
        withCredentials: true,
      });
      return res.data.data;
    },
    refetchOnWindowFocus: true,
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

type Error = { message: string; status: number; state: boolean };
export const useProductMutation = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error>({
    message: "",
    status: 0,
    state: false,
  });
  const productMutation = useMutation({
    mutationFn: async (product: FormData) => {
      try {
        await service.post("/product", product, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setError({
          message: "",
          status: 0,
          state: false,
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          setError({
            message: err.response?.data.message as string,
            status: Number(err.response?.status),
            state: true,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { error, productMutation };
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
import service from "@/service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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
  slug: string;
}

type ProductOptions = {
  page: number;
  s: string;
  filter: string;
  order: string;
};
export const useProducts = ({ page, s, filter, order }: ProductOptions) => {
  const { data, isLoading, isFetched } = useQuery<{
    products: Product[];
    totalPages: number;
  }>({
    queryKey: ["products", page, s, filter, order],
    queryFn: async () => {
      const res = await service.get("/products", {
        params: {
          s,
          filter,
          order,
          page,
        },
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  return { data, isLoading, isFetched };
};

export const useHomeProducts = ({ s, f }: { s: string; f: string }) => {
  const { data, isLoading, isFetched } = useQuery<Product[]>({
    queryKey: ["home/products", s, f],
    queryFn: async () => {
      const res = await service.get("/products/home", {
        params: {
          s,
          f,
        },
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  return { data, isLoading, isFetched };
};

export const useProductInfinite = ({ s, f }: { s: string; f: string }) => {
  const fetchProjects = async (page: number) => {
    const res = await service.get("/products/home", {
      params: {
        page,
        s,
        f,
      },
    });
    return res.data.data;
  };

  const query = useInfiniteQuery({
    queryKey: ["home/products", s, f],
    queryFn: ({ pageParam }) => fetchProjects(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, page) =>
      lastPage.length === 12 ? page.length + 1 : undefined,
  });

  return query;
};

type ProductUrlOptions = {
  key: string[];
  url: string;
};

export const useProductUrl = ({ key, url }: ProductUrlOptions) => {
  const { data, isLoading, isFetched } = useQuery<Product[]>({
    queryKey: key,
    queryFn: async () => {
      const res = await service.get(url, {
        withCredentials: true,
      });
      return res.data.data;
    },
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, isFetched };
};

export const useProduct = (slug: string) => {
  const { data, isLoading } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await service.get(`/products/${slug}`, {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  return { data, isLoading };
};
