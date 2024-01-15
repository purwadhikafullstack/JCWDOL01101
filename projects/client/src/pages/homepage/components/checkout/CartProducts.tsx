import React from "react";
import { cartProducts } from "@/context/UserContext";
import { formatToIDR } from "@/lib/utils";

type Props = {
  cartProducts: cartProducts[];
};

const CartProducts = ({ cartProducts }: Props) => {
  return (
    <div className="space-y-3">
      {cartProducts &&
        cartProducts.map(({ product, id, quantity }) => (
          <div key={id} className="text-sm text-muted-foreground">
            <div className="flex justify-between items-center ">
              <span>
                <p className="font-bold text-foreground line-clamp-1 w-[250px]">
                  {product.name}
                </p>
                <p className="text-xs">{`${quantity} item X ${formatToIDR(
                  product.price
                )}`}</p>
              </span>
              <span>{formatToIDR(String(quantity * product.price))}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CartProducts;
