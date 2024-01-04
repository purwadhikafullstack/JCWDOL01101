import { Order, OrderDetails } from "@/hooks/useOrder";
import { Product } from "@/hooks/useProduct";
import React from "react";
import OrderProduct from "./OrderProduct";
import { format } from "date-fns";
import { formatToIDR } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type props = {
  order: Order;
};

const OrderCard = ({ order }: props) => {
  return (
    <>
      <div className="border p-2 shadow-md  rounded-xl">
        <div className="flex justify-between items-center">
          <div className="mt-2">
            <div className="ml-2">
              <div className="text-red-600 font-bold mr-4">{order.status} </div>
              {order.invoice} | {format(new Date(order.createdAt), "P")}
            </div>

            <div className="space-y-2 ml-5 mt-2 p-2">
              {order.orderDetails.map((orderDetail) => (
                <OrderProduct
                  key={orderDetail.id}
                  product={orderDetail.product}
                  qty={orderDetail.quantity}
                />
              ))}
            </div>
          </div>

          <div className="mr-8 p-16 border-l-4 grid-cols-1 h-full">
            {"Total Harga"}
            <div className="font-bold">{formatToIDR(order.totalPrice)}</div>
          </div>
        </div>
        {order.status === "PENDING" ? (
          <div className="flex justify-end mr-6 mb-2">
            <Button>Cancel Order</Button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default OrderCard;
