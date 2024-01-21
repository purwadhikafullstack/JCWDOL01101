import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDate, formatToIDR } from "@/lib/utils"
import ChangeOrderButton from "./ChangeOrderButton"
import { Order } from "@/hooks/useOrder"
import OrderAction from "./order/OrderAction"
import { Check, History, XCircle } from "lucide-react"

function OrderTable({
  data,
}: {
  data: {
    orders: Order[]
    totalPages: number
    totalSuccess: number
    totalPending: number
    totalFailed: number
    totalOngoing: number
  }
}) {
  return (
    <>
      <div className="flex gap-4 justify-between py-4">
        {[
          { title: "Success", icon: Check, value: data.totalSuccess },
          { title: "Ongoing", icon: History, value: data.totalOngoing },
          { title: "Failed", icon: XCircle, value: data.totalFailed },
        ].map((stat) => (
          <div className="flex bg-background border rounded-lg p-4 shadow-sm flex-col w-full items-start">
            <div className="flex items-center gap-4">
              <span className="rounded-md p-2 inline-block">
                <stat.icon className="w-8 h-8 text-primary" />
              </span>
              <div>
                <p className="text-muted-foreground">{stat.title}</p>
                <p className="font-bold text-xl">
                  {stat.title === "Failed"
                    ? `${stat.value} Order(s)`
                    : formatToIDR(stat.value)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="invoice" name="Invoice" />
            </TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="warehouseId" name="Warehouse" />
            </TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="user" name="Customer" />
            </TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="totalPrice" name="Total Price" />
            </TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="shippingFee" name="Shipping Fee" />
            </TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="status" name="Status" />
            </TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="createdAt" name="Order Date" />
            </TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.orders && data.orders.length > 0 ? (
            <>
              {data?.orders!.map((order, i) => (
                <TableRow key={order.id}>
                  <TableCell className="w-[80px]">{i + 1}</TableCell>
                  <TableCell className="capitalize font-medium text-center">
                    {order.invoice}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.warehouseOrder.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.userOrder.email}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatToIDR(order.totalPrice)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatToIDR(order.shippingFee)}
                  </TableCell>
                  <TableCell className="text-center">{order.status}</TableCell>
                  <TableCell className="text-center">
                    {getDate(order.createdAt!.toLocaleString())}
                  </TableCell>
                  <OrderAction order={order} />
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center h-24">
                No Orders
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}

export default OrderTable
