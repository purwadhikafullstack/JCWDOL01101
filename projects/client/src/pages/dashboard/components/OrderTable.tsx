import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDate, formatToIDR } from "@/lib/utils";
import ChangeOrderButton from "./ChangeOrderButton";
import { Order } from "@/hooks/useOrder";
import OrderAction from "./order/OrderAction";

function OrderTable({
  data,
}: {
  data: { orders: Order[]; totalPages: number; totalSuccess:number; totalPending:number; totalFailed:number;  totalOngoing:number  
    // salesSummary:{totalSuccess:number}; 
  };
}) {
  // const statusTotals = data?.totals;

  // const statusTotals = React.useMemo(() => {
  //   const totals = {
  //     success: 0,
  //     pending: 0,
  //     canceled: 0,
  //     rejected: 0,
  //     ongoing: 0,
  //   };
  //   data.orders.forEach((order) => {
  //     if (order.status === "SUCCESS") totals.success += order.totalPrice;
  //     else if (order.status === "PENDING") totals.pending += order.totalPrice;
  //     else if (order.status === "CANCELED") totals.canceled += order.totalPrice;
  //     else if (order.status === "REJECTED") totals.rejected += order.totalPrice;
  //     else if (
  //       order.status === "DELIVERED" ||
  //       order.status === "SHIPPED" ||
  //       order.status === "WAITING" ||
  //       order.status === "PROCESS"
  //     )
  //       totals.ongoing += order.totalPrice;
  //   });
  //   return totals;
  // }, [data.orders]);

  return (
    <>
      <div className="border text-center justify-evenly p-1">
        <p className="font-bold">SALES REPORT</p>
        <div className="flex justify-evenly text-center">
          <div className="flex bg-green-500 border-4 rounded-xl p-2 font-semibold">
            Success: {formatToIDR(data.totalSuccess)}
          </div>
          <div className="flex bg-blue-400  p-2 border-4 rounded-xl font-semibold">
            Pending: {formatToIDR(data.totalPending)}
          </div>
          <div className="flex bg-yellow-400 p-2 border-4 rounded-xl font-semibold">
            Ongoing: {formatToIDR(data.totalOngoing)}
          </div>
          <div className="flex bg-red-400 p-2 border-4 rounded-xl font-semibold">
            Failed: {formatToIDR(data.totalFailed)}
          </div>
        </div>
      </div>
      {/* <div className="flex justify-evenly text-center">
        {statusTotals && ( // Menambahkan pengecekan apakah statusTotals sudah ada
          <>
            <div className="flex bg-green-500 border-4 rounded-xl p-2 font-semibold">
              Success:{" "}
              {statusTotals.success ? formatToIDR(statusTotals.success) : 0}
            </div>
            <div className="flex bg-blue-400  p-2 border-4 rounded-xl font-semibold">
              Pending:{" "}
              {statusTotals.pending ? formatToIDR(statusTotals.pending) : 0}
            </div>
            <div className="flex bg-yellow-400 p-2 border-4 rounded-xl font-semibold">
              Ongoing:{" "}
              {statusTotals.ongoing ? formatToIDR(statusTotals.ongoing) : 0}
            </div>
            <div className="flex bg-red-400 p-2 border-4 rounded-xl font-semibold">
              Failed:{" "}
              {statusTotals.failed ? formatToIDR(statusTotals.failed) : 0}
            </div>
          </>
        )}
      </div> */}

      <Table>
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
                    {order.userOrder.firstname} {order.userOrder.lastname}
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
                  <TableCell className="text-center">
                    <OrderAction order={order} />
                  </TableCell>
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
  );
}

export default OrderTable;
