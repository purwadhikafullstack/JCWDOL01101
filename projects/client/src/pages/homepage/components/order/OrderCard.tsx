import {
  Order,
  OrderDetails,
  useCancelOrder,
  useConfirmOrder,
} from "@/hooks/useOrder";
import { Product } from "@/hooks/useProduct";
import React from "react";
import OrderProduct from "./OrderProduct";
import { format } from "date-fns";
import { formatToIDR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CancelOrder from "./OrderCancel";
import ConfirmOrder from "./OrderConfrim";

type props = {
  order: Order;
};

const OrderCard = ({ order }: props) => {
  return (
    <>
      <Dialog>
        <div className="border p-2 shadow-md  rounded-xl">
          <div className="flex justify-between items-center">
            <div className="mt-2">
              <div className="ml-2">
                <div className="text-red-600 font-bold mr-4">
                  {order.status}{" "}
                </div>
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
              <DialogTrigger>
                <Button>Cancel Order</Button>
              </DialogTrigger>
              <CancelOrder orderId={order.id as number} />
            </div>
          ) : (
            ""
          )}
          {order.status === "DELIVERED" ? (
            <div className="flex justify-end mr-6 mb-2">
              <DialogTrigger>
                <Button>Finish Order</Button>
              </DialogTrigger>
              <ConfirmOrder orderId={order.id as number} />
            </div>
          ) : (
            ""
          )}
        </div>
      </Dialog>
    </>
  );
};

export default OrderCard;
