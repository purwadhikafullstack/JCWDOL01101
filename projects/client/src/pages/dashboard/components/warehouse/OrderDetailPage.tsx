import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useOrderDetails } from "@/hooks/useOrder"
import { formatToIDR } from "@/lib/utils"
import { baseURL } from "@/service"
import { Loader2 } from "lucide-react"
import React from "react"

const OrderDetailPage = ({ orderId }: { orderId: number }) => {
  const { data, isLoading } = useOrderDetails(orderId)
  const qty =
    data!.OrderDetails.reduce((sum, order) => sum + order.quantity, 0) || 0
  const price =
    data!.OrderDetails.reduce(
      (sum, order) => sum + order.quantity * order.price,
      0
    ) || 0
  return (
    <Dialog>
      <DialogTrigger className="hover:text-primary hover:underline">
        {data?.invoice}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            Order Details of
            {isLoading ? " ... " : <p>{data?.invoice}</p>}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex mx-auto h-24 items-center">
            <Loader2 className={"animate-spin w-12 h-12 mr-2"} />
          </div>
        ) : (
          <div className="text-sm">
            {data?.OrderDetails.map((item, i) => (
              <div key={i} className="flex gap-2 items-center mt-2 w-full">
                <img
                  src={`${baseURL}/images/${item.product.primaryImage}`}
                  className="w-[80px] h-[80px] object-contain rounded-lg"
                />
                <div className="flex flex-col gap-1 w-full">
                  <span>{item.product.name}</span>
                  <span>Size : {item.size.label}</span>
                  <span>Pcs : {item.quantity}</span>
                </div>
                <span className="font-bold self-end">
                  {formatToIDR(item.product.price)}
                </span>
              </div>
            ))}
            <Separator className="mt-4 mb-2 bg-current" />
            <div className="flex flex-col gap-2 justify-between">
              <div className="flex gap-2 justify-between items-center">
                {`Total Price (${qty}) ${
                  qty && qty > 1 ? "products" : "product"
                }`}
                <p className="font-bold">{formatToIDR(price)}</p>
              </div>
              <div className="flex gap-2 justify-between items-center">
                Total Shipping Fee
                <p className="font-bold">{formatToIDR(data?.shippingFee!)}</p>
              </div>
              <div className="flex gap-2 justify-between items-center font-bold">
                Grand Total
                <p>{formatToIDR(data?.totalPrice!)}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OrderDetailPage
