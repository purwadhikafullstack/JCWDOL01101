import React from "react";
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
import { AlertTriangle } from "lucide-react";
import ProductDialog from "./ProductDialog";


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
              <DropdownMenu>
                <DropdownMenuTrigger className="w-[100px] text-start text-ellipsis overflow-hidden whitespace-nowrap">
                  {product.inventory.map((inv) => inv.sizes.label).join(", ")}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Available Size</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {product.inventory.map((inv) => (
                    <DropdownMenuItem
                      key={inv.id}
                      className="flex justify-between items-center"
                    >
                      <p>{inv.sizes.label} </p>
                      <p className="text-xs text-muted-foreground">
                        {inv.stock} {inv.stock > 1 ? "pcs" : "pc"}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    <DotsHorizontalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {user?.publicMetadata.role === "ADMIN" && (
                      <>
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
                      </>
                    )}
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
          </TableRow>
        );
      })}
    </>
  );
};

export default ProductTableRow;
