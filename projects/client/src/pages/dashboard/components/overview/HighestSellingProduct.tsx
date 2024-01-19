import React from "react";
import { useGetOverviewHigestSellingProduct } from "@/hooks/useOrder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseURL } from "@/service";
import { formatToIDR } from "@/lib/utils";

const HighestSellingProduct = () => {
  const { data } = useGetOverviewHigestSellingProduct();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Product Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Sold</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="flex items-center gap-4">
                <img
                  src={`${baseURL}/images/${product.primaryImage}`}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <span className="ml-2 line-clamp-1">{product.name}</span>
              </TableCell>
              <TableCell>{formatToIDR(product.price)}</TableCell>
              <TableCell className="text-right">
                {product.inventory.reduce((a, b) => a + b.sold, 0)} pcs
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  {product.inventory.reduce((a, b) => a + b.stock, 0) > 0 ? (
                    <span className="text-green-500 bg-green-100 dark:bg-green-50/10 px-2 py-1 rounded-full flex items-center w-max">
                      <span className="inline-block w-2 h-2 mr-1 bg-green-500 rounded-full" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-500 bg-red-100 dark:bg-red-50/10 px-2 py-1 rounded-full flex items-center w-max">
                      <span className="inline-block w-2 h-2 mr-1 bg-red-500 rounded-full" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default HighestSellingProduct;
