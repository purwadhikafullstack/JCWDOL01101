import React from "react";
import { useCurrentUserOrders } from "@/hooks/useOrder";
import DatePicker from "../components/order/DatePicker";
import SearchInput from "../components/order/SearchInput";
import OrderStatus from "../components/order/OrderStatus";
import OrderCard from "../components/order/OrderCard";
import { useSearchParams } from "react-router-dom";
import OrderPagination from "../components/order/OrderPagination";

const UserOrder = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "All";
  const page = searchParams.get("page") || "1";
  const q = searchParams.get("q") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const { data } = useCurrentUserOrders({ status, page, q, limit: 6, from, to });

  return (
    <div>
      <h1>Order List</h1>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <SearchInput />
          <DatePicker />
        </div>
        <OrderStatus />
      </div>
      <div className="space-y-3 mt-6">
        {data &&
          data.orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
      </div>
      <div className="flex justify-center my-4">
        {data && <OrderPagination totalPages={data?.totalPages} />}
      </div>
    </div>
  );
};

export default UserOrder;
