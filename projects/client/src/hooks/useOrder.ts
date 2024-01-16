import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "./useProduct";
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
  userOrder: { firstname: string; lastname: string };
  orderDetails: OrderDetails[];
  paymentDetails: Payment;
}

export interface OrderDetails {
  id: number;
  orderId: number;
  sizeId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Payment {
  id: number | undefined;
  orderId?: number;
  method: string;
  virtualAccount: string;
  status: string;
  paymentDate: Date;
}

type Params = {
  status: string;
  page: string;
  q: string;
  limit?: number;
};

export const useCurrentUserOrders = ({ status, page, q, limit }: Params) => {
  const { getToken } = useAuth();
  const query = useQuery<{ orders: Order[]; totalPages: number }>({
    queryKey: ["orders/current-user", status, page, q, limit],
    queryFn: async () => {
      const res = await service.get("/orders/user/current-user", {
        params: {
          q,
          page,
          status,
          limit,
        },
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
  });

  return query;
};

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
  to: Date | undefined;
  from: Date | undefined;
};
export const getAllOrders = ({
  page,
  s,
  filter,
  order,
  limit,
  warehouse,
  status,
  to,
  from,
}: orderOptions) => {
  const { getToken } = useAuth();
  const { data, isLoading, isFetched } = useQuery<{
    orders: Order[];
    totalPages: number;
    totalSuccess:number;
  }>({
    queryKey: ["orders", page, s, filter, order, warehouse, status, to, from],
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
          to,
          from,
        },
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      // console.log("useOrder========================")
      // console.log(res.data.data);
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
