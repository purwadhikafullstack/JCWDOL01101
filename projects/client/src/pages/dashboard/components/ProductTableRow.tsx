import React from "react";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { TableCell, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import ProductDialog from "./ProductDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  products: Product[];
}

const ProductTableRow = ({ products }: Props) => {
  return (
    <>
      {products.map((product, i) => {
        return (
          <TableRow key={i}>
            <TableCell className="w-[80px]">{i + 1}</TableCell>
            <TableCell>
              <p className="overflow-hidden whitespace-nowrap text-ellipsis w-[200px]">
                {product.name}
              </p>
            </TableCell>
            <TableCell>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger className="w-[100px] overflow-hidden whitespace-nowrap text-ellipsis text-start">
                    {product.inventory.map((inv) => inv.sizes.label).join(", ")}
                  </TooltipTrigger>
                  <TooltipContent>
                    {product.inventory.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between"
                      >
                        <div className="mr-2">{inv.sizes.label}</div>
                        <div className="text-muted-foreground">
                          ({inv.stock})
                        </div>
                      </div>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>{formatToIDR(String(product.price))}</TableCell>
            <TableCell className="text-center">
              {product.weight}
              <i className="text-xs"> grams</i>
            </TableCell>
            <TableCell className="text-center">
              {product.inventory.reduce((curr, prev) => curr + prev.stock, 0)}
            </TableCell>
            <TableCell className="text-center">
              {product.inventory.reduce((curr, prev) => curr + prev.sold, 0)}
            </TableCell>
            <TableCell className="w-[100px]">
              <p className="overflow-hidden whitespace-nowrap text-ellipsis w-[100px text-center">
                {product.productCategory ? product.productCategory.name : "-"}
              </p>
            </TableCell>
            <TableCell className="w-[150px]">
              <p className="overflow-hidden whitespace-nowrap text-ellipsis w-[150px]">
                {product.description}
              </p>
            </TableCell>
            <TableCell className="text-center">
              {product.productImage.length > 0 ? (
                <img
                  className="w-[40px] mx-auto"
                  src={`${baseURL}/images/${product.primaryImage}`}
                  alt={product.name}
                />
              ) : (
                <span className="flex flex-col w-full items-center justify-center text-center text-primary/70">
                  <AlertTriangle className="w-4 h-4  " />
                  <p className="text-xs w-20  break-words">no image</p>
                </span>
              )}
            </TableCell>
            <TableCell className="text-center">
              <ProductDialog product={product} />
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default ProductTableRow;
