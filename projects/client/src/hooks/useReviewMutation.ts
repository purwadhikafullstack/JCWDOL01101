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
      queryClient.invalidateQueries({ queryKey: ["review"] });
    },
  });

  return addressMutation;
};
