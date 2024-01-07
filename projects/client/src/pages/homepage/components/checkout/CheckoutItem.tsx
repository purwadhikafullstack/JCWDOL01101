import { Separator } from "@/components/ui/separator";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { ChevronUp, Verified } from "lucide-react";
import React, { useState } from "react";
import SelectCourier from "./SelectCourier";
import { Address } from "@/hooks/useAddress";
import { useBoundStore } from "@/store/client/useStore";
import { Warehouse } from "@/hooks/useWarehouse";
import { Trans, useTranslation } from "react-i18next";
import { cartProducts } from "@/context/UserContext";

const CheckoutItem = ({
  cp,
  index,
  length,
  activeAddress,
  warehouse,
}: {
  index: number;
  length: number;
  cp: cartProducts;
  warehouse: Warehouse | undefined;
  activeAddress: Address | undefined;
}) => {
  const { t } = useTranslation();
  const fee = useBoundStore((state) => state.fee);
  const [show, setShow] = useState(false);
  const shippingCost = fee[cp.id] ? fee[cp.id].cost[0].value : 0;
  const total = cp.product.price * cp.quantity + shippingCost;

  return (
    <div className="my-4">
      {length > 1 && (
        <b>
          {t("checkoutPage.cartItem.title")} {index + 1}
        </b>
      )}
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <div className="flex flex-col">
            <span className="flex items-center">
              <Verified className="text-primary h-4 w-4 mr-2" />
              <b className="">Toten Official</b>
            </span>
            <span className="text-xs text-muted-foreground ml-6">
              {t("checkoutPage.cartItem.address")}{" "}
              {warehouse?.warehouseAddress?.cityWarehouse?.cityName}
            </span>
            <div className="flex gap-2 items-start text-sm mt-2">
              <img
                src={`${baseURL}/images/${cp.product.primaryImage}`}
                className="w-[80px] h-[80px] object-contain"
              />
              <div className="flex flex-col gap-2">
                <span>{cp.product.name}</span>
                <span>Size: {cp.size.label}</span>
                <span className="font-bold">
                  {formatToIDR(cp.product.price)}
                </span>
              </div>
            </div>
          </div>
          <Separator className="my-2" />
        </div>
        {warehouse?.warehouseAddress && (
          <SelectCourier
            quantity={cp.quantity}
            product={cp.product}
            address={activeAddress}
            origin={warehouse.warehouseAddress.cityId}
            cartProductId={cp.id}
          />
        )}
      </div>
      <Separator className="mt-6 mb-2" />
      <div className="w-full flex justify-between items-center">
        <b>{t("checkoutPage.cartItem.subtotal")}</b>
        <div
          className="flex gap-2 items-center cursor-pointer select-none"
          onClick={() => setShow(!show)}
        >
          <b>{formatToIDR(total.toString())}</b>
          <ChevronUp
            className={`w-4 h-4 text-muted-foreground  transform ${
              show && "rotate-180"
            } transition-all duration-200`}
          />
        </div>
      </div>
      {show && (
        <>
          <div className="w-full flex justify-between items-center text-sm">
            <p className="text-muted-foreground">
              <Trans
                i18nKey="checkoutPage.cartItem.price"
                values={{ total: cp.quantity }}
              >
                Price ({cp.quantity} item)
              </Trans>
            </p>
            <b>{formatToIDR(cp.product.price.toString())}</b>
          </div>
          <div className="w-full flex justify-between items-center text-sm">
            <p className="text-muted-foreground">
              {t("checkoutPage.cartItem.shippingFee")}
            </p>
            <b>{formatToIDR(shippingCost.toString())}</b>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutItem;
