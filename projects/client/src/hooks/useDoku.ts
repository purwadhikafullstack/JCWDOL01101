import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";

type PaymentData = {
  totalPrice: number;
  payment: string;
};

export const useDokuPaymentIntent = () => {
  const { getToken } = useAuth();
  const doku = useMutation({
    mutationFn: async (data: PaymentData) => {
      const res = await service.post("/doku/payment-url", data, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
  });

  return doku;
};
