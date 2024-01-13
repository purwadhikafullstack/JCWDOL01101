import React from "react";
import { Separator } from "@/components/ui/separator";
import PriceFilterForm from "./PriceFilterForm";
import SizeFilterForm from "./SizeFilterForm";
import { useTranslation } from "react-i18next";

const Filter = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <Separator className="my-2" />
      <SizeFilterForm />
      <Separator className="my-2" />
      <div className="space-y-2">
        <span className="uppercase">{t("productsPage.price.label")}</span>
        <div className="flex flex-col gap-2 w-full">
          <PriceFilterForm
            param="pmin"
            placeholder={t("productsPage.price.pmin")}
          />
          <PriceFilterForm
            param="pmax"
            placeholder={t("productsPage.price.pmax")}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
