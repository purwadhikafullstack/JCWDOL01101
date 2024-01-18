import React from "react";
import { Product } from "@/hooks/useProduct";
import { cn, formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { TableCell, TableRow } from "@/components/ui/table";
import { AlertTriangle, ChevronUp } from "lucide-react";
import ProductDialog from "./ProductDialog";
import useOutsideClick from "@/hooks/useClickOutside";
import ProductTableRowChild from "./ProductTableRowChild";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface Props {
  product: Product;
  index: number;
}

const ProductTableRow = ({ product, index }: Props) => {
  const [openCollapsible, setOpenCollapsible] = React.useState(false);
  const totalStock = product.inventory.reduce(
    (curr, prev) => curr + prev.stock,
    0
  );
  const totalSold = product.inventory.reduce(
    (curr, prev) => curr + prev.sold,
    0
  );

  const ref = React.useRef<any | null>(null);

  useOutsideClick(ref, () => {
    setOpenCollapsible(false);
  });

  return (
    <>
      <Collapsible
        open={openCollapsible}
        onOpenChange={(value) => {
          setOpenCollapsible(value);
        }}
        asChild
      >
        <>
          <TableRow
            ref={ref}
            data-collapsed={openCollapsible}
            className="data-[collapsed=true]:bg-muted"
          >
            <TableCell className="w-[80px]">
              <div>{index + 1}</div>
            </TableCell>
            <TableCell className="text-center w-[100px]">
              {product.productImage.length > 0 ? (
                <img
                  className="w-14 h-14 mx-auto object-cover"
                  src={`${baseURL}/images/${product.primaryImage}`}
                  alt={product.name}
                />
              ) : (
                <span className="flex flex-col w-full items-center justify-center text-center text-primary/70">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-xs w-20  break-words">no image</p>
                </span>
              )}
            </TableCell>
            <TableCell>
              <p className="line-clamp-1 w-[200px]">{product.name}</p>
            </TableCell>
            <TableCell>
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between cursor-pointer h-10">
                  <p className="line-clamp-1 w-[60px] mr-4 select-none">
                    {product.inventory.map((inv) => inv.sizes.label).join(", ")}
                  </p>
                  <ChevronUp
                    className={cn(
                      "w-4 h-4 transition-all duration-200 text-muted-foreground",
                      !openCollapsible && "rotate-180"
                    )}
                  />
                </button>
              </CollapsibleTrigger>
            </TableCell>
            <TableCell className="text-end">
              {formatToIDR(String(product.price))}
            </TableCell>
            <TableCell className="text-center">
              {product.weight}
              <i className="text-xs"> grams</i>
            </TableCell>
            <TableCell className="text-center">
              {totalStock}
              {totalStock > 0 && (
                <i className="text-xs">{totalStock > 1 ? " pcs" : " pc"}</i>
              )}
            </TableCell>
            <TableCell className="text-center">
              {totalSold}
              {totalSold > 0 && (
                <i className="text-xs">{totalSold > 1 ? " pcs" : " pc"}</i>
              )}
            </TableCell>
            <TableCell className="w-[100px]">
              <p className="overflow-hidden whitespace-nowrap text-ellipsis w-[100px text-center">
                {product.productCategory ? product.productCategory.name : "-"}
              </p>
            </TableCell>
            <TableCell className="xl:w-[350px]">
              <p className="line-clamp-2">{product.description}</p>
            </TableCell>
            <TableCell className="text-center">
              <ProductDialog product={product} />
            </TableCell>
          </TableRow>
          <CollapsibleContent asChild>
            {product.inventory.length > 0 && (
              <ProductTableRowChild inventories={product.inventory} />
            )}
          </CollapsibleContent>
        </>
      </Collapsible>
    </>
  );
};

export default ProductTableRow;
