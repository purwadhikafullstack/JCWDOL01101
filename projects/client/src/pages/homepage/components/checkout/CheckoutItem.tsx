import React from "react";
import { Separator } from "@/components/ui/separator";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { Verified } from "lucide-react";
import { Warehouse } from "@/hooks/useWarehouse";
import { useTranslation } from "react-i18next";
import { cartProducts } from "@/context/UserContext";

const CheckoutItem = ({
  cp,
  index,
  length,
  warehouse,
}: {
  index: number;
  length: number;
  cp: cartProducts;
  warehouse: Warehouse | undefined;
}) => {
  const { t } = useTranslation();
  return (
    <div className="my-4">
      {length > 1 && (
        <b>
          {t("checkoutPage.cartItem.title")} {index + 1}
        </b>
      )}
      <div>
        <div className="flex flex-col">
          <span className="flex items-center">
            <b className="">Toten Official</b>
            <Verified className="text-primary h-3 w-3 ml-2" />
          </span>
          <span className="text-xs text-muted-foreground">
            {t("checkoutPage.cartItem.address")}{" "}
            {warehouse?.warehouseAddress?.cityWarehouse?.cityName}
          </span>
          <div className="flex gap-2 items-start text-sm mt-2 w-full">
            <img
              src={`${baseURL}/images/${cp.product.primaryImage}`}
              className="w-[80px] h-[80px] object-contain"
            />
            <div className="flex flex-col gap-2 w-full">
              <span>{cp.product.name}</span>
              <span>Size: {cp.size.label}</span>
            </div>
            <span className="font-bold self-end">
              {formatToIDR(cp.product.price)}
            </span>
          </div>
        </div>
      </div>
      <Separator className="mt-4 mb-2" />
    </div>
  );
};

export default CheckoutItem;
