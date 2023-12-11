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
    <div className="flex gap-2  justify-between items-center">
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
        <SelectTrigger className="w-[180px]">
          <SelectValue
            defaultValue="featured"
            placeholder={t("productsPage.filter.sub")}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hs">Featured Product</SelectItem>
          <SelectItem value="newest">Just Arrived</SelectItem>
          <SelectItem value="lth">Low to High</SelectItem>
          <SelectItem value="htl">High to Low</SelectItem>
          <SelectItem value="rating">Highest Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectBy;
