import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  nickname: string;
  title: string;
  status: "ACTIVE" | "DEACTIVATED" | "DELETED";
  comment: string;
  createdAt: string;
}

export interface RatingCount {
  rating: number;
  count: number;
}

export interface ReviewByProduct {
  totalReviews: number;
  averageRating: number;
  ratingCounts: RatingCount[];
  reviews: Review[];
}

export const useReviewByProduct = (
  productId: number | undefined,
  limit = 3
) => {
  const cart = useQuery<ReviewByProduct>({
    queryKey: ["reviews", productId, limit],
    queryFn: async () => {
      const res = await service.get(`/reviews/product/${productId}`, {
        params: {
          limit,
        },
      });
      return res.data.data;
    },
    enabled: !!productId,
  });

  return cart;
};

interface DashboardReview extends ReviewByProduct {
  totalPages: number;
}

type Params = {
  productId: number | undefined;
  status: string;
  rating: string;
  page: number;
  limit: number;
};

export const useDashboardReviewProduct = ({
  page,
  limit,
  rating,
  status,
  productId,
}: Params) => {
  const review = useQuery<DashboardReview>({
    queryKey: ["dashboard/reviews", page, productId, limit, status, rating],
    queryFn: async () => {
      const res = await service.get(`/reviews/dashboard/product/${productId}`, {
        params: {
          page,
          limit,
          status,
          rating,
        },
      });
      return res.data.data;
    },
    enabled: !!productId,
  });

  return review;
};

export const useReviewsInfinite = ({
  productId,
  limit = 5,
}: {
  productId?: number;
  limit?: number;
}) => {
  const fetchProjects = async (page: number) => {
    const res = await service.get(`/reviews/product/${productId}`, {
      params: {
        page,
        limit,
      },
    });
    return res.data.data;
  };

  const query = useInfiniteQuery({
    queryKey: ["reviews", productId, limit],
    enabled: !!productId,
    queryFn: ({ pageParam }) => fetchProjects(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, page) => {
      return lastPage.reviews.length === limit ? page.length + 1 : undefined;
    },
  });

  return query;
};
