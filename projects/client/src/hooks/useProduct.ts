import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Size } from "./useSize";
import { Review } from "./useReview";
import { Warehouse } from "./useWarehouse";
import { OrderDetails } from "./interfaces/Order";

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  stock: number;
  sold: number;
  weight: number;
  description: string;
  status: string;
  size: string;
  slug: string;
  primaryImage: string;
  productImage: Image[];
  productReviews: Review[];
  productCategory: Category;
  productWishlist: Wishlist[];
  inventory: Inventory[];
}

export interface Wishlist {
  id: number;
  userId: number;
  productId: number;
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

export const useProductsDashboard = () => {
  const query = useQuery<Product[]>({
    queryKey: ["products/dashbaord"],
    queryFn: async () => {
      const res = await service.get("/products/dashboard");
      return res.data.data;
    },
  });

  return query;
};

export const useProducts = (params: ProductOptions) => {
  const { s, size, page, order, limit, status, filter, warehouse, category } =
    params;
  const { getToken } = useAuth();
  const { data, isLoading, isFetched } = useQuery<{
    products: Product[];
    totalPages: number;
  }>({
    queryKey: [
      "products",
      s,
      size,
      page,
      order,
      limit,
      status,
      filter,
      warehouse,
      category,
    ],
    queryFn: async () => {
      const res = await service.get("/products", {
        params,
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
  const { getToken } = useAuth();
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
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
      withCredentials: true,
    });
    return res.data.data;
  };

  const query = useInfiniteQuery({
    queryKey: ["homepage", category, f, size, pmax, pmin],
    queryFn: ({ pageParam }) => fetchProjects(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, page) =>
      lastPage.length === limit ? page.length + 1 : undefined,
  });

  return query;
};

export const useNewestProducts = () => {
  const { getToken } = useAuth();
  const products = useQuery<Product[]>({
    queryKey: ["products", "newest"],
    queryFn: async () => {
      const res = await service.get("/products/new", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      return res.data.data;
    },
    refetchOnWindowFocus: true,
  });

  return products;
};

export const useHighestSellProducts = (limit = 3) => {
  const { getToken } = useAuth();
  const products = useQuery<OrderDetails[]>({
    queryKey: ["highest-sell", limit],
    queryFn: async () => {
      const res = await service.get(`/products/highest-sell`, {
        params: {
          limit,
        },
        headers: {
          Authorization: `Bearer ${await getToken()}`,
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

export const useProduct = (slug: string | undefined) => {
  const { getToken } = useAuth();
  const product = useQuery<ProductData>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await service.get(`/products/${slug}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        withCredentials: true,
      });
      return res.data.data;
    },
    enabled: !!slug,
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
  const { getToken } = useAuth();
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["product", categoryId, productId],
    queryFn: async () => {
      const res = await service.get(
        `/products/${productId}/category/${categoryId}`,
        {
          params: {
            limit,
          },
          headers: {
            Authorization: `Bearer ${await getToken()}`,
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
