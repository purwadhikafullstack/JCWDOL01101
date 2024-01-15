import React from "react";
import { Separator } from "@/components/ui/separator";
import { useSelectedItem } from "@/hooks/useCheckout";
import { formatToIDR } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import CartProducts from "./CartProducts";
import { useBoundStore } from "@/store/client/useStore";

type Props = {
  paymentMethod: string;
  totalPrice: number;
  shippingFee: number;
  address: any;
  cartId: number;
};

const PaymentModalItems = ({
  paymentMethod,
  totalPrice,
  shippingFee,
  cartId,
  address,
}: Props) => {
  const { t } = useTranslation();
  const { data: cartProducts } = useSelectedItem(cartId);
  const courierService = useBoundStore((state) => state.service);

  return (
    <div className="mb-8 p-4 space-y-4">
      <b className="text-sm">{t("checkoutPage.paymentModal.summary")}</b>
      <ul className="text-sm text-muted-foreground">
        <li className="flex gap-2 justify-between items-center">
          <span>{t("checkoutPage.paymentModal.paymentMethod")}</span>
          <span>{paymentMethod}</span>
        </li>
        <Separator className="my-2" />
        <li className="flex gap-2 justify-between items-center">
          <span>
            {t("checkoutPage.paymentModal.totalPrice")} (
            {cartProducts ? cartProducts.cartProducts.length : 0})
          </span>
          <b>{formatToIDR(totalPrice)}</b>
        </li>
        <li className="flex gap-2 justify-between items-center">
          <span>Courier (Service)</span>
          <span className="flex items-center">
            <b className="uppercase">{courierService.name}</b> (
            <p>{courierService.service}</p>)
          </span>
        </li>
        <li className="flex gap-2 justify-between items-center">
          <span>{t("checkoutPage.paymentModal.shippingFee")}</span>
          <b>{formatToIDR(shippingFee)}</b>
        </li>
      </ul>
      <div>
        <b className="text-sm">{t("checkoutPage.paymentModal.purchased")}</b>
        <Separator className="my-2" />
        {cartProducts && cartProducts.cartProducts.length > 0 && (
          <CartProducts cartProducts={cartProducts.cartProducts} />
        )}
        <Separator className="my-2" />
      </div>
      <div>
        <b className="text-sm">
          {t("checkoutPage.paymentModal.shippingAddress")}
        </b>
        <p className="w-[300px] text-sm text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">
          {`${address.address}, ${address.city.cityName}, ${address.city.province}`}
        </p>
      </div>
    </div>
  );
};

export default PaymentModalItems;
