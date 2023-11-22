import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CartData = {
  externalId: string;
  productId: number;
  quantity: number;
};

export const useAddCart = (productId: number | undefined) => {
  const queryClient = useQueryClient();
  const cartMutation = useMutation({
    mutationFn: async (cartData: CartData) => {
      await service.post("/cart", cartData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-product", productId] });
    },
  });
  return cartMutation;
};

type qtyData = {
  productId: number;
  cartId: number;
  qty?: number;
};
export const useChageQty = () => {
  const queryClient = useQueryClient();
  const quantityMutation = useMutation({
    mutationFn: async (data: qtyData) => {
      await service.put("/cart/quantity", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return quantityMutation;
};

export const useDeleteCartProduct = (cartProductId: number) => {
  const queryClient = useQueryClient();
  const cartMutation = useMutation({
    mutationFn: async () => {
      await service.patch(`/cart-product/${cartProductId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return cartMutation;
};
