import { cartProducts } from "@/context/UserContext";
import { formatToIDR } from "@/lib/utils";
import { Fee } from "@/store/client/slice";
import { t } from "i18next";
import React from "react";

type Props = {
  cartProducts: cartProducts[];
  shipping: Fee;
};

const CartProducts = ({ cartProducts, shipping }: Props) => {
  return (
    <div className="space-y-3">
      {cartProducts &&
        cartProducts.map(({ product, id, quantity }) => (
          <div key={id} className="text-sm text-muted-foreground">
            <div className="flex justify-between items-center ">
              <span>
                <p className="font-bold text-foreground w-[240px] text-ellipsis overflow-hidden whitespace-nowrap">
                  {product.name}
                </p>
                <p className="text-xs">{`${quantity} X ${formatToIDR(
                  product.price.toString()
                )}`}</p>
              </span>
              <span>{formatToIDR(String(quantity * product.price))}</span>
            </div>
            <div className="flex justify-between items-center ">
              <p>{t("checkoutPage.paymentModal.shippingCost")}</p>
              <p>
                {formatToIDR(String(shipping[product.id!]?.cost[0].value || 0))}
              </p>
            </div>
            <b>{shipping[product.id!]?.service}</b>
            <p>
              {t("checkoutPage.paymentModal.estimation")}{" "}
              {shipping[product.id!]?.cost[0].etd}
            </p>
          </div>
        ))}
    </div>
  );
};

export default CartProducts;
