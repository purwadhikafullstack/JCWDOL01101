import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
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
  productImage: Image[];
  productCategory: Category;
  inventory: Inventory[];
  warehouse: string; // tes
}

export interface Warehouse {
  capacity: number;
  name: string;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
}

export interface Image {
  id?: number;
  productId?: number;
  image: string;
}

type ProductOptions = {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
  warehouse: string;
};

export interface ProductWarehouse {
  name: string;
  capacity: number;
  products: Product[];
}

export interface Inventory {
  stock: number;
  sold: number;
  warehouse: Warehouse;
}

export const useProducts = ({
  page,
  s,
  filter,
  order,
  limit,
  warehouse,
}: ProductOptions) => {
  const { getToken } = useAuth();
  const { data, isLoading, isFetched } = useQuery<{
    products: Product[];
    totalPages: number;
  }>({
    queryKey: ["products", page, s, filter, order, warehouse],
    queryFn: async () => {
      const res = await service.get("/products", {
        params: {
          s,
          page,
          order,
          limit,
          filter,
          warehouse,
        },
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
  });

  return { data, isLoading, isFetched };
};

export const useProductInfinite = ({
  f,
  category,
  limit = 12,
}: {
  category: string;
  f: string;
  limit?: number;
  search?: string;
}) => {
  const fetchProjects = async (page: number) => {
    const res = await service.get("/products/home", {
      params: {
        f,
        page,
        limit,
        category,
      },
    });
    return res.data.data;
  };

  const query = useInfiniteQuery({
    queryKey: ["home/products", category, f],
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

export const useSearchProducts = (search: string) => {
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["search/products", search],
    queryFn: async () => {
      const res = await service.get(`/products/search/q`, {
        params: {
          search,
        },
      });
      return res.data.data;
    },
    enabled: !!search,
  });

  return { data, isLoading };
};
