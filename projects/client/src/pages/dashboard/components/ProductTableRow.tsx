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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import DeleteProduct from "./product/DeleteProduct";
import { useUser } from "@clerk/clerk-react";
import { AlertTriangle } from "lucide-react";
import AddStockForm from "./product/AddStockForm";

interface ProductTableRowProps {
  products: Product[];
  selectedWarehouse: string | undefined;
}

const ProductTableRow = ({ products, selectedWarehouse }: ProductTableRowProps) => {
  const { user } = useUser();
  const [stocks, setStocks] = useState<Record<number, any>>({});
  const [dialog, setDialog] = useState("")
  const [currentStock, setCurrentStock] = useState(0);

  useEffect(() => {
    const fetchStocks = async () => {
      const newStocks: Record<number, any> = {};

      for (const product of products) {
        if (product && product.id) {
          try {
            const response = await service.get(`inventories/${selectedWarehouse}/${product.id}`);
            const data = response.data.data;
            setCurrentStock(response.data.data.stock);


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
    setDialog("manageStock")
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
          <TableCell className="font-medium">{product.name}</TableCell>
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
          <TableCell className="overflow-hidden whitespace-nowrap text-ellipsis w-[100px]">
            {product.productCategory.name}
          </TableCell>
          <TableCell className="overflow-hidden whitespace-nowrap text-ellipsis w-[200px]">
            {product.description}
          </TableCell>
          <TableCell className="text-center">
            {product.productImage.length > 0 ? (
              <img
                className="w-[40px] mx-auto"
                src={`${baseURL}/images/${product.productImage[0].image}`}
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
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    <DotsHorizontalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Link to={`/dashboard/product/edit/${product.slug}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <div onClick={handleDialogDelete} className="w-200">
                      <DialogTrigger className="w-full" >
                        <DropdownMenuItem className="w-full cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </div>
                    <DropdownMenuSeparator />
                    <div onClick={handleDialogStock} >
                      <DialogTrigger className="w-full">
                        <DropdownMenuItem className="cursor-pointer">
                          Manage Stock
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </div>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
                {dialog === "manageStock" && (
                  <AddStockForm productId={product.id} selectedWarehouse={selectedWarehouse} productName={product.name} />
                )}
                {dialog === "delete" && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure deleting {product.name} ?
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete
                        your product and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DeleteProduct productId={Number(product.id)} />
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
};

export default ProductTableRow;
