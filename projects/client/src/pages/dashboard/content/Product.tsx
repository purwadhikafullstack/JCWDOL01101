import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProduct";
import { baseURL } from "@/service";
import DeleteProduct from "./components/DeleteProduct";
import { DialogClose } from "@radix-ui/react-dialog";
import { formatToIDR } from "@/lib/utils";
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton";

const Product = () => {
  const { data: products, isLoading } = useProducts();
  if (isLoading) {
    return <ProductsPageSkeleton />;
  }
  return (
    <div className="flex flex-col p-2 w-full">
      <Link
        to="/dashboard/product/create"
        className={buttonVariants({
          variant: "default",
          className: "self-end",
        })}
      >
        <Plus className="w-4 h-4 mr-2" /> New Product
      </Link>
      <Input className="w-[300px]" placeholder="search product ..." />
      <div className="border rounded-md mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Image</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Price</TableHead>
              <TableHead className="w-[150px] text-center">
                Weight (grams)
              </TableHead>
              <TableHead className="w-[100px] text-center">Stock</TableHead>
              <TableHead className="w-[100px] text-center">Sold</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products?.length > 0 ? (
              <>
                {products?.map((product, i) => (
                  <TableRow key={product.id}>
                    <TableCell className="w-[80px]">{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <img
                        className="w-[40px] mx-auto"
                        src={`${baseURL}/${product.image}`}
                        alt={product.name}
                      />
                    </TableCell>
                    <TableCell>{product.categoryId}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{formatToIDR(String(product.price))}</TableCell>
                    <TableCell className="text-center">
                      {product.weight}
                      <i className="text-xs"> grams</i>
                    </TableCell>
                    <TableCell className="text-center">
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.sold}
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
                            <Link to={`/dashboard/product/${product.id}`}>
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
                              This action cannot be undone. This will
                              permanently delete your product and remove your
                              data from our servers.
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
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center h-24">
                  No Products
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-2 items-center justify-end mt-4">
        <p>Page 1 of 10</p>
        <div className="flex gap-2 items-center">
          <Button variant="outline">
            <ChevronLeft />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
