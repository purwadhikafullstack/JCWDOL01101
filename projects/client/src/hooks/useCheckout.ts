import { cartProducts } from "@/context/UserContext";
import service from "@/service";
import { useQuery } from "@tanstack/react-query";

type Courier = {
  code: string;
  name: string;
  costs: {
    service: string;
    description: string;
    cost: {
      value: number;
      etd: string;
      note: string;
    }[];
  }[];
};
export const useCourier = ({
  origin,
  destination,
  weight,
  courier,
}: {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}) => {
  const query = useQuery<Courier>({
    queryKey: ["courier", courier, destination, weight, origin],
    queryFn: async () => {
      const res = await service.get("/checkout/courier", {
        params: {
          origin,
          destination,
          weight,
          courier,
        },
      });
      return res.data.data;
    },
    enabled: !!courier && !!origin && !!destination && !!weight,
  });

  return query;
};

export const useSelectedItem = (cartId: number | undefined) => {
  const cartProducts = useQuery<cartProducts[]>({
    queryKey: ["selected-cart", cartId],
    queryFn: async () => {
      const res = await service.get(`/checkout/cart/${cartId}/products`);
      return res.data.data;
    },
    enabled: !!cartId,
  });

  return cartProducts;
};
