import React from "react";

import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
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
import DeleteProduct from "./DeleteProduct";
import { useUser } from "@clerk/clerk-react";

const ProductTableRow = ({ products }: { products: Product[] }) => {
  const { user } = useUser();
  return (
    <>
      {products.map((product, i) => (
        <TableRow key={product.id}>
          <TableCell className="w-[80px]">{i + 1}</TableCell>
          <TableCell className="font-medium">{product.name}</TableCell>
          <TableCell>{formatToIDR(String(product.price))}</TableCell>
          <TableCell className="text-center">
            {product.weight}
            <i className="text-xs"> grams</i>
          </TableCell>
          <TableCell className="text-center">{product.stock}</TableCell>
          <TableCell className="text-center">{product.sold}</TableCell>
          <TableCell>{product.categoryId}</TableCell>
          <TableCell>{product.description}</TableCell>
          <TableCell className="text-center">
            <img
              className="w-[40px] mx-auto"
              src={`${baseURL}/${product.image}`}
              alt={product.name}
            />
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
                    <Link to={`/dashboard/product/${product.slug}`}>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DialogTrigger className="w-full">
                      <DropdownMenuItem className="w-full cursor-pointer">
                        Delete
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
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
              </Dialog>
            </TableCell>
          )}
        </TableRow>
      ))}
    </>
  );
};

export default ProductTableRow;
