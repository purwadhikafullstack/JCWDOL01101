import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type PaymentData = {
  cartId: number;
  payment: string;
  totalPrice: number;
  warehouseId: number;
};

export const useDokuPaymentIntent = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const doku = useMutation({
    mutationFn: async (data: PaymentData) => {
      const res = await service.post("/doku/payment-url", data, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return doku;
};
