import service from "@/service";
import { useQuery } from "@tanstack/react-query";

export const useDokuPaymentIntent = () => {
  const stripe = useQuery({
    queryKey: ["doku/secret"],
    queryFn: async () => {
      const res = await service.get("/doku/payment-url");
      return res.data.data;
    },
  });

  return stripe;
};
