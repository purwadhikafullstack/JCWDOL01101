import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface Payment {
  orderId: number;
  method: string;
  virtualAccount: string;
  status: string;
  paymentDate: Date;
}

export const usePaymentDetail = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: Payment) => {
      await service.post("/payment-detail", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-detail"] });
    },
  });
};
