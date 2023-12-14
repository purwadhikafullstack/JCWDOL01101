import React, { useState, useEffect } from "react";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import service, { baseURL } from "@/service";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { buttonVariants, Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useUser } from "@clerk/clerk-react";
import { AlertTriangle } from "lucide-react";
import AddStockForm from "./product/AddStockForm";

interface ProductTableRowProps {
  products: Product[];
  selectedWarehouse: string | undefined;
}
import ProductDialog from "./ProductDialog";

const ProductTableRow = ({ products, selectedWarehouse }: ProductTableRowProps) => {
  const { user } = useUser();
  const [stocks, setStocks] = useState<Record<number, any>>({});
  const [dialog, setDialog] = useState("")

  useEffect(() => {
    const fetchStocks = async () => {
      const newStocks: Record<number, any> = {};

      for (const product of products) {
        if (product && product.id) {
          try {
            const response = await service.get(`inventories/${selectedWarehouse}/${product.id}`);
            const data = response.data.data;

            if (response.status !== 200) {
              throw new Error(data.message || 'Could not fetch stock.');
            }

            newStocks[product.id] = data.stock;
          } catch (error) {
            console.error('Fetch stock error:', error);
          }
        }
      }

      setStocks(newStocks);
    };

    fetchStocks();
  }, [selectedWarehouse, products]);

  const handleDialogStock = () => {
    setDialog("add")
    console.log(dialog)
  }

  const handleDialogDelete = () => {
    setDialog("delete")
    console.log(dialog)

  }

  return (
    <>
      {products.map((product, i) => (
        <TableRow key={i}>
          <TableCell className="w-[80px]">{i + 1}</TableCell>
          <TableCell>
            <p className="overflow-hidden whitespace-nowrap text-ellipsis w-[200px]">
              {product.name}
            </p>
          </TableCell>
          <TableCell>{formatToIDR(String(product.price))}</TableCell>
          <TableCell className="text-center">
            {product.weight}
            <i className="text-xs"> grams</i>
          </TableCell>
          <TableCell className="text-center">
            {product && product.id && stocks && stocks[product.id] ? stocks[product.id] : 'N/A'}
          </TableCell>

          <TableCell className="text-center">
            {product.inventory[0].sold}
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
          {user?.publicMetadata.role === "ADMIN" && (
            <TableCell className="text-center">
              <ProductDialog product={product} />
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
};

export default ProductTableRow;
