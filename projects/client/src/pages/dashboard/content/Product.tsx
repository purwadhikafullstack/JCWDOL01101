import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, SearchIcon, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProduct";
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton";
import { useDebounce } from "use-debounce";
import ProductTableRow from "../components/ProductTableRow";
import TablePagination from "../components/TablePagination";
import ChangeOrderButton from "../components/ChangeOrderButton";

const Product = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const currentPage = Number(searchParams.get("page"));
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch] = useDebounce(searchTerm, 1000);

  const { data, isLoading, isFetched } = useProducts({
    page: currentPage,
    s: debounceSearch,
    filter: searchParams.get("filter") || "",
    order: searchParams.get("order") || "",
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
      <div className="flex gap-2 items-center">
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
      </div>
      <div className="border rounded-md mt-2">
        {isLoading ? (
          <ProductsPageSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>
                  <ChangeOrderButton paramKey="name" name="Name" />
                </TableHead>
                <TableHead className="w-[150px]">
                  <ChangeOrderButton paramKey="price" name="Price" />
                </TableHead>
                <TableHead className="w-[150px] text-center">
                  <ChangeOrderButton paramKey="weight" name="Weight (grams)" />
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  <ChangeOrderButton paramKey="stock" name="Stock" />
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  <ChangeOrderButton paramKey="sold" name="Sold" />
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetched && data?.products.length! > 0 ? (
                <ProductTableRow products={data?.products!} />
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
        <TablePagination
          currentPage={currentPage}
          dataLength={data?.products.length!}
          totalPages={data?.totalPages!}
        />
      </div>
    </div>
  );
};

export default Product;
