import { Cart, cartProducts } from "@/context/UserContext";
import service from "@/service";
import { useQuery } from "@tanstack/react-query";

export const useCart = (userId: number, hasCart: boolean) => {
  const cart = useQuery<{
    cart: Cart;
    totalQuantity: number;
    totalPrice: number;
  }>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await service.get(`/cart/${userId}`);
      return res.data.data;
    },
    enabled: !!userId && hasCart,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return cart;
};

export const useCartProductOnSize = (
  isCart: boolean,
  productId: number,
  sizeId: number
) => {
  const cart = useQuery<{
    cartProduct: cartProducts;
    stock: number;
  }>({
    queryKey: ["cart-product", productId, sizeId],
    queryFn: async () => {
      const res = await service.get(
        `/cart/product/${productId}/size/${sizeId}`
      );
      return res.data.data;
    },
    enabled: !!productId && isCart,
  });

  return cart;
};

export const useCartProduct = (isCart: boolean, productId: number) => {
  const cart = useQuery<cartProducts[]>({
    queryKey: ["cart-product", productId],
    queryFn: async () => {
      const res = await service.get(`/cart/product/${productId}`);
      return res.data.data;
    },
    enabled: !!productId && isCart,
  });

  return cart;
};
