import { Button } from "@/components/ui/button";
import { formatToIDR } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ShoppingSummary = ({
  someTrue,
  totalPrice,
  totalQuantity,
}: {
  someTrue: boolean;
  totalPrice: number;
  totalQuantity: number;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="w-[320px] relative ">
      <div className="w-ful sticky top-[100px] ">
        <div className="w-full h-full px-4 py-6 border space-y-2">
          <p className="font-bold">{t("cartPage.summary.title")}</p>
          <span className="w-full flex text-sm items-center justify-between text-muted-foreground">
            <p>{t("cartPage.summary.total")}</p>
            <p>{formatToIDR(totalPrice.toString())}</p>
          </span>
          <Separator />
          <span className="w-full font-bold flex items-center justify-between">
            <p className="text-lg">{t("cartPage.summary.grandTotal")}</p>
            <p>{formatToIDR(totalPrice.toString())}</p>
          </span>
          <Button
            disabled={!someTrue}
            onClick={() => {
              navigate("/checkout");
            }}
            className="w-full rounded-none"
          >
            {t("cartPage.summary.buyBtn")}({totalQuantity})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingSummary;
