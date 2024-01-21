import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import React from "react";

type props = {
  product: Product;
  qty: number;
};

const OrderProduct = ({ product, qty }: props) => {
  return (
    <div className="flex gap-2">
      <img src={`${baseURL}/images/${product.primaryImage}`} className="w-20 h-20 object-cover object-top" />

      <div>
        <p>{product.name}</p>
        <p>{qty} items x {formatToIDR(product.price)}</p>
      </div>
    </div>
  );
};

export default OrderProduct;
