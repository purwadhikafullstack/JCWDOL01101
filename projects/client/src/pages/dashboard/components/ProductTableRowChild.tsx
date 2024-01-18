import { TableCell, TableRow } from "@/components/ui/table";
import { Inventory } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import React from "react";

type Props = {
  inventories: Inventory[];
};

const ProductTableRowChild = ({ inventories }: Props) => {
  return inventories.map((inv, i) => (
    <TableRow key={i}>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <p className="text-muted-foreground line-clamp-1">{inv.product.name}</p>
      </TableCell>
      <TableCell className="text-center">{inv.sizes.label}</TableCell>
      <TableCell className="text-end">
        <p className="text-muted-foreground line-clamp-1">
          {formatToIDR(inv.product.price)}
        </p>
      </TableCell>
      <TableCell className="text-center text-muted-foreground">
        {inv.product.weight}
        <i className="text-xs"> grams</i>
      </TableCell>
      <TableCell className="text-center">
        {inv.stock}
        {inv.stock > 0 && (
          <i className="text-xs ml-1">{inv.stock > 1 ? "pcs" : "pc"}</i>
        )}
      </TableCell>
      <TableCell className="text-center">
        {inv.sold}
        {inv.sold > 0 && (
          <i className="text-xs ml-1">{inv.sold > 1 ? "pcs" : "pc"}</i>
        )}
      </TableCell>
      <TableCell className="w-[100px] text-center text-muted-foreground">
        {inv.product.productCategory.name}
      </TableCell>
      <TableCell className="w-[200px]">
        <p className="line-clamp-1 text-muted-foreground">
          {inv.product.description}
        </p>
      </TableCell>
      <TableCell className="text-center"></TableCell>
    </TableRow>
  ));
};

export default ProductTableRowChild;
