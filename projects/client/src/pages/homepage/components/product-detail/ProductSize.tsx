import React from "react";
import { useProduct } from "@/hooks/useProduct";
import { useSize } from "@/hooks/useSize";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

type Props = {
  selectedProductSize: number | null;
  setSelectedProductSize: React.Dispatch<React.SetStateAction<number | null>>;
};
const ProductSize = ({
  selectedProductSize,
  setSelectedProductSize,
}: Props) => {
  const { slug } = useParams();
  const { data: pd } = useProduct(slug || "");
  const { data: sizes } = useSize();
  return (
    pd &&
    sizes && (
      <div className="flex gap-2 items-center flex-wrap">
        {sizes.map((size) => {
          const availableSize = pd.totalStockBySize
            .flat()
            .find((invSize) => invSize.sizeId === size.id);
          return availableSize && availableSize.total > 0 ? (
            <div
              onClick={() => setSelectedProductSize(availableSize.sizeId)}
              key={availableSize.sizeId}
              className={cn(
                "p-2 border hover:bg-primary hover:text-white hover:border-primary rounded-md text-center w-max justify-center cursor-pointer flex items-center",
                selectedProductSize === availableSize.sizeId &&
                  "bg-primary text-white border-primary"
              )}
            >
              {availableSize["sizes.label"]}
              <span className="text-sm ml-2">({availableSize.total})</span>
            </div>
          ) : (
            <div
              key={size.id}
              className="p-2 border rounded-md text-center w-12 text-muted-foreground relative select-none"
            >
              <span className="border-b absolute transform -rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-muted-foreground w-14 select-none"></span>
              {size.label}
            </div>
          );
        })}
      </div>
    )
  );
};

export default ProductSize;
