import { Separator } from "@/components/ui/separator";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import PriceFilterForm from "./PriceFilterForm";
import SizeFilterForm from "./SizeFilterForm";

const Filter = () => {
  return (
    <div className="space-y-3">
      <Separator className="my-2" />
      <SizeFilterForm />
      <Separator className="my-2" />
      <div className="space-y-2">
        <span className="uppercase">Price</span>
        <div className="flex flex-col gap-2 w-full">
          <PriceFilterForm param="pmin" placeholder="Minimum price" />
          <PriceFilterForm param="pmax" placeholder="Maximum price" />
        </div>
      </div>
    </div>
  );
};

export default Filter;
