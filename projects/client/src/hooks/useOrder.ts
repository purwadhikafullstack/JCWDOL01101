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
  createdAt: Date;
  deletedAt: Date;
  warehouseOrder: { name: string };
  userOrder: { firstname: string, lastname: string; }
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

type orderOptions = {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
  warehouse: string;
  status: string;
};
export const getAllOrders = ({
  page,
  s,
  filter,
  order,
  limit,
  warehouse,
  status,
}: orderOptions) => {
  const { getToken } = useAuth();
  const { data, isLoading, isFetched } = useQuery<{
    orders: Order[];
    totalPages: number;
  }>({
    queryKey: ["orders", page, s, filter, order, warehouse, status],
    queryFn: async () => {
      const res = await service.get("/orders", {
        params: {
          s,
          page,
          order,
          limit,
          filter,
          warehouse,
          status,
        },
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
  });

  return { data, isLoading, isFetched };
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
