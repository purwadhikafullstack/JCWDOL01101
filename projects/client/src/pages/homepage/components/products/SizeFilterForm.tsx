import { useSize } from "@/hooks/useSize";
import { cn } from "@/lib/utils";
import { FilterSize } from "@/store/client/filterSizeSlice";
import { useBoundStore } from "@/store/client/useStore";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const SizeFilterForm = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const setFilterSize = useBoundStore((state) => state.setSize);
  const sizeParams = searchParams.get("size");
  const currentSize = new Set<number>(sizeParams?.split(",").map(Number) || []);
  const { data: sizes } = useSize();
  return (
    <div className="flex flex-col  items-start gap-2">
      <span className="uppercase">{t("productsPage.size")}</span>
      <div className="flex flex-wrap gap-1">
        {sizes &&
          sizes.map((size) => (
            <div
              onClick={() => {
                currentSize.has(size.id)
                  ? currentSize.delete(size.id)
                  : currentSize.add(size.id);
                const sizeArray = Array.from(currentSize);
                setSearchParams({ size: sizeArray.join(",") });

                const filterSizeLabel: FilterSize[] = sizeArray.map((id) => {
                  const size = sizes.find((size) => size.id === id);
                  return {
                    id: size?.id || 0,
                    label: size?.label || "",
                  };
                });
                setFilterSize(filterSizeLabel);
              }}
              className={cn(
                "border hover:border-primary/80 hover:bg-muted cursor-pointer w-12 lg:w-11 p-2 grid place-content-center rounded-md",
                currentSize.has(size.id) && "border-primary"
              )}
              key={size.id}
            >
              {size.label}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SizeFilterForm;
