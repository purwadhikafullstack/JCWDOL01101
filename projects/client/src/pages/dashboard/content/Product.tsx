import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, SearchIcon } from "lucide-react";
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
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProduct";
import { baseURL } from "@/service";
import DeleteProduct from "../components/DeleteProduct";
import { DialogClose } from "@radix-ui/react-dialog";
import { formatToIDR } from "@/lib/utils";
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton";
import { useDebounce } from "use-debounce";

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch] = useDebounce(searchTerm, 1000);

  const { data, isLoading, isFetched } = useProducts({
    page: currentPage,
    s: debounceSearch,
  });
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
      <div className="relative w-[300px]">
        <SearchIcon className="absolute h-4 w-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchParams((params) => {
              params.set("s", e.target.value);
              return params;
            });
            setSearchTerm(e.target.value);
          }}
          className=" w-full pl-10"
          placeholder="search product ..."
        />
      </div>
      <div className="border rounded-md mt-2">
        {isLoading ? (
          <ProductsPageSkeleton />
        ) : (
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
              {isFetched && data?.products.length! > 0 ? (
                <>
                  {data?.products!.map((product, i) => (
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
                      <TableCell>
                        {formatToIDR(String(product.price))}
                      </TableCell>
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
        )}
      </div>
      <div className="flex gap-2 items-center justify-end mt-4">
        <div className="flex gap-2 items-center">
          <p className="text-sm">Page 1 of {data?.totalPages || 0}</p>
          <Button
            disabled={currentPage <= 1}
            onClick={() => {
              setSearchParams((params) => {
                if (currentPage > 1) {
                  params.set("page", (currentPage - 1).toString());
                }
                return params;
              });
            }}
            variant="outline"
          >
            <ChevronLeft />
          </Button>
          <Button
            disabled={isFetched ? data?.products.length! !== 10 : false}
            onClick={() => {
              setSearchParams((params) => {
                params.set("page", (currentPage + 1).toString());
                return params;
              });
            }}
            variant="outline"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
