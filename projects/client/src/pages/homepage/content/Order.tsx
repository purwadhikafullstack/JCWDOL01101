import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

const Order = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, []);
  return <div>Order</div>;
};

export default Order;
