import React from "react";
import { Separator } from "@/components/ui/separator";
import PriceFilterForm from "./PriceFilterForm";
import SizeFilterForm from "./SizeFilterForm";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/useCategory";
import ActiveFilter from "./ActiveFilter";

const Filter = () => {
  const [_, setSearchParams] = useSearchParams();
  const { data: categories } = useCategories();
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center justify-between my-2">
        <Label className="uppercase tracking-wide">
          {t("productsPage.category")}
        </Label>
      </div>
      <Select
        onValueChange={(value) => {
          setSearchParams((params) => {
            params.set("category", value);
            return params;
          });
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("productsPage.category")} />
        </SelectTrigger>
        {categories && categories.length > 0 && (
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        )}
      </Select>
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
      <Separator className="my-2" />
      <ActiveFilter />
    </div>
  );
};

export default Filter;
