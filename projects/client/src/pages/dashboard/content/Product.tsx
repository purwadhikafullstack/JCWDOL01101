import React, { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Plus, SearchIcon } from "lucide-react";
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
import { useUser } from "@clerk/clerk-react";
import { useBoundStore } from "@/store/client/useStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetWarehouse } from "@/hooks/useWarehouse";

const Product = () => {
  const { user } = useUser();
  const ROLE = user?.publicMetadata.role || "CUSTOMER";
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const currentPage = Number(searchParams.get("page"));
  const searchTerm = searchParams.get("s") || "";
  const [debounceSearch] = useDebounce(searchTerm, 1000);

  const { data: warehouses } = useGetWarehouse();
  const { data, isLoading } = useProducts({
    page: currentPage,
    s: debounceSearch,
    filter: searchParams.get("filter") || "",
    order: searchParams.get("order") || "",
    limit: 10,
    warehouse: searchParams.get("warehouse") || "",
  });

  const clearImage = useBoundStore((state) => state.clearImage);
  useEffect(() => {
    clearImage();
  }, []);

  return (
    <div className="flex flex-col p-2 w-full">
      {ROLE === "ADMIN" && (
        <Link
          to="/dashboard/product/create"
          className={buttonVariants({
            variant: "default",
            className: "self-end",
          })}
        >
          <Plus className="w-4 h-4 mr-2" /> New Product
        </Link>
      )}
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
            }}
            className=" w-full pl-10"
            placeholder="search product ..."
          />
        </div>
        {ROLE === "ADMIN" && (
          <div className="flex gap-2 items-center">
            {warehouses && warehouses.length > 0 && (
              <Select
                defaultValue={warehouses ? warehouses[0].name : ""}
                onValueChange={(value) => {
                  setSearchParams((params) => {
                    params.set("warehouse", value);
                    return params;
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.name}>
                      <div className="flex items-center w-[300px] justify-between">
                        <span className="font-bold w-full self-start">
                          {warehouse.name}
                        </span>
                        <span className="flex gap-2 text-center justify-end text-muted-foreground w-full">
                          {warehouse.warehouseAddress?.cityWarehouse?.cityName}
                          <MapPin className="w-4 h-4 mr-2" />
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
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
                <TableHead className="w-[150px] text-center">
                  <ChangeOrderButton paramKey="stock" name="Stock" />
                </TableHead>
                <TableHead className="w-[150px] text-center">
                  <ChangeOrderButton paramKey="sold" name="Sold" />
                </TableHead>
                <TableHead className="w-[100px]">Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Image</TableHead>
                {ROLE === "ADMIN" && (
                  <TableHead className="text-center">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.products && data.products.length > 0 ? (
                <ProductTableRow products={data.products} />
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
