import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ReviewData {
  productId: number;
  rating: number;
  nickname: string;
  title: string;
  comment: string;
}

export const usePostReview = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async (reviewData: ReviewData) => {
      return await service.post("/reviews", reviewData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard/reviews"] });
    },
  });

  return addressMutation;
};

export type STATUS = "ACTIVE" | "DEACTIVATED" | "DELETED";
export const useChangeReviewStatus = (reviewId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async ({ status }: { status: STATUS }) => {
      return await service.patch(
        `/reviews/${reviewId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard/reviews"] });
    },
  });

  return addressMutation;
};
