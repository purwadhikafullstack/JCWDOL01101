import { Cart, cartProducts } from "@/context/UserContext";
import service from "@/service";
import { useQuery } from "@tanstack/react-query";

export const useCart = (userId: number) => {
  const cart = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await service.get(`/cart/${userId}`);
      return res.data.data;
    },
    enabled: !!userId,
  });

  return cart;
};

export const useCartProduct = (productId: number) => {
  const cart = useQuery<cartProducts>({
    queryKey: ["cart-product", productId],
    queryFn: async () => {
      const res = await service.get(`/cart/product/${productId}`);
      return res.data.data;
    },
    enabled: !!productId,
  });

  return cart;
};
