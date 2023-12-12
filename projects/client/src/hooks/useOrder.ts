import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
export interface Order {
  id: number;
  warehouseId: number;
  totalPrice: number;
  shippingFee: number;
  userId: number;
  invoice: string;
  status: string;
  deletedAt: Date;
}

export const useOrders = (userId: number | undefined) => {
  const { getToken } = useAuth();
  const query = useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const res = await service.get(`/orders/${userId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
    enabled: !!userId,
  });

  return query;
};

export const useProductIsOrder = (
  userId: string | undefined,
  productId: number | undefined
) => {
  const { getToken } = useAuth();
  const query = useQuery<Order[]>({
    queryKey: ["orders", userId, productId],
    queryFn: async () => {
      const res = await service.get(`/orders/allow-review/${productId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
    enabled: !!userId && !!productId,
  });

  return query;
};
