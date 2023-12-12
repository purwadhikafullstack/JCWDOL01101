import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const SelectBy = () => {
  const { t } = useTranslation();
  const [_, setSearchParams] = useSearchParams();
  return (
    <div className="flex flex-col md:flex-row  gap-2 w-full lg:justify-end items-start md:items-center">
      <h3 className="uppercase tracking-wide">
        {t("productsPage.filter.header")}
      </h3>
      <Select
        onValueChange={(value) => {
          setSearchParams((params) => {
            params.set("f", value);
            return params;
          });
        }}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue
            defaultValue="featured"
            placeholder={t("productsPage.filter.sub")}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hs">{t("productsPage.filter.select1")}</SelectItem>
          <SelectItem value="newest">
            {t("productsPage.filter.select2")}
          </SelectItem>
          <SelectItem value="lth">
            {t("productsPage.filter.select3")}
          </SelectItem>
          <SelectItem value="htl">
            {t("productsPage.filter.select4")}
          </SelectItem>
          <SelectItem value="rating">
            {t("productsPage.filter.select5")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectBy;
