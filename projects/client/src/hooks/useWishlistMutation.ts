import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleWishlist = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async ({ productId }: { productId: number }) => {
      return await service.post(
        `/wishlist/${productId}`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
      queryClient.invalidateQueries({ queryKey: ["products", "newest"] });
      queryClient.invalidateQueries({ queryKey: ["highest-sell"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["last-seen-product"] });
    },
  });

  return addressMutation;
};

export const useDeleteWishlist = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async ({ productId }: { productId: number }) => {
      return await service.delete(`/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
      queryClient.invalidateQueries({ queryKey: ["products", "newest"] });
      queryClient.invalidateQueries({ queryKey: ["highest-sell"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  return addressMutation;
};
