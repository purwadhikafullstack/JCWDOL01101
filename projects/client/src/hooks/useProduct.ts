import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Size } from "./useSize";

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
  weight: number;
  description: string;
  status: string;
  size: string;
  slug: string;
  primaryImage: string;
  productImage: Image[];
  productCategory: Category;
  productWishlist: Wishlist[];
  inventory: Inventory[];
}

export interface Wishlist {
  id: number;
  userId: number;
  productId: number;
}

export interface Warehouse {
  capacity: number;
  name: string;
}

export interface Category {
  id?: number;
  name: string;
  image: string;
  slug: string;
}

export interface Image {
  id?: number;
  productId?: number;
  image: string;
}

type ProductOptions = {
  s: string;
  size: string;
  page: number;
  order: string;
  limit: number;
  status: string;
  filter: string;
  warehouse: string;
  category: string;
};

export interface ProductWarehouse {
  name: string;
  capacity: number;
  products: Product[];
}

export interface Inventory {
  id: number;
  stock: number;
  sold: number;
  sizeId: number;
  product: Product;
  productId: number;
  status: string;
  sizes: Size;
  warehouse: Warehouse;
}

export const useProducts = ({
  s,
  size,
  page,
  order,
  limit,
  status,
  filter,
  category,
  warehouse,
}: ProductOptions) => {
  const { getToken } = useAuth();
  const { data, isLoading, isFetched } = useQuery<{
    products: Product[];
    totalPages: number;
  }>({
    queryKey: [
      "products",
      status,
      page,
      s,
      filter,
      order,
      warehouse,
      category,
      size,
    ],
    queryFn: async () => {
      const res = await service.get("/products", {
        params: {
          s,
          size,
          page,
          order,
          limit,
          filter,
          status,
          category,
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

type ProductParams = {
  category: string;
  f: string;
  limit?: number;
  search?: string;
  size?: string;
  pmax?: string;
  pmin?: string;
};
export const useProductInfinite = ({
  f,
  size,
  pmax,
  pmin,
  category,
  limit = 12,
}: ProductParams) => {
  const fetchProjects = async (page: number) => {
    const res = await service.get("/products/home", {
      params: {
        f,
        page,
        size,
        pmax,
        pmin,
        limit,
        category,
      },
    });
    return res.data.data;
  };

  const query = useInfiniteQuery({
    queryKey: ["home/products", category, f, size, pmax, pmin],
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

export const useHighestSellProducts = (limit = 3) => {
  const products = useQuery<Product[]>({
    queryKey: ["highest-sell", limit],
    queryFn: async () => {
      const res = await service.get(`/products/highest-sell`, {
        params: {
          limit,
        },
      });
      return res.data.data;
    },
  });

  return products;
};

export type ProductData = {
  product: Product;
  totalStock: number;
  totalSold: number;
  totalStockBySize: {
    sizeId: number;
    total: number;
    ["sizes.label"]: number;
  }[];
};

export const useProduct = (slug: string) => {
  const product = useQuery<ProductData>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await service.get(`/products/${slug}`, {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  return product;
};

export const useProductsByCategory = (categoryId: number, limit = 12) => {
  const products = useQuery<Product>({
    queryKey: ["product/category", categoryId],
    queryFn: async () => {
      const res = await service.get(`/products/category/${categoryId}`, {
        params: {
          limit,
        },
      });
      return res.data.data;
    },
  });
  return products;
};

export const useProductByCategory = (
  productId: number | undefined,
  categoryId: number | undefined,
  limit = 10
) => {
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["product", categoryId, productId],
    queryFn: async () => {
      const res = await service.get(
        `/products/${productId}/category/${categoryId}`,
        {
          params: {
            limit,
          },
        }
      );
      return res.data.data;
    },
    enabled: !!categoryId && !!productId,
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
