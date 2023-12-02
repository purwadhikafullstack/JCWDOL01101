import service from "@/service";
import { useQuery } from "@tanstack/react-query";

export const usePaymentIntent = () => {
  const stripe = useQuery({
    queryKey: ["stripe/secret"],
    queryFn: async () => {
      const res = await service.get("/stripe/secret");
      return res.data.data;
    },
  });

  return stripe;
};
