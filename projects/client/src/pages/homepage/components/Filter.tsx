import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const Filter = () => {
  const { t } = useTranslation();
  const [_, setSearchParams] = useSearchParams({
    s: "all",
  });
  return (
    <div className="flex flex-col">
      <Separator className="my-2" />
      <div className="flex gap-2 justify-between items-center">
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
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="lth">Lowest to Highest</SelectItem>
            <SelectItem value="htl">Highest to Lowest</SelectItem>
            <SelectItem value="hs">Highest Sell</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filter;
