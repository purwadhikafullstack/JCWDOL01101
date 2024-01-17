import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Product } from "./useProduct";

export interface WishlistData {
  id: number;
  userId: number;
  productId: number;
  productWishlist: Product;
}

export const useWishlist = (limit = 5) => {
  const { getToken } = useAuth();
  const fetchProjects = async (page: number) => {
    const res = await service.get(`/wishlist`, {
      params: {
        page,
        limit,
      },
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    return res.data.data;
  };

  const query = useInfiniteQuery({
    queryKey: ["wishlist", limit],
    queryFn: ({ pageParam }) => fetchProjects(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, page) => {
      return lastPage && lastPage.wishlist && lastPage.wishlist.length === limit
        ? page.length + 1
        : undefined;
    },
  });

  return query;
};
