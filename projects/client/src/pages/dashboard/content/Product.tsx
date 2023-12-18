import React, { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, MapPin, Plus, SearchIcon, X } from "lucide-react";
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
import { useCategories } from "@/hooks/useCategory";
import ReviewStatusCombobox from "../components/ReviewStatusCombobox";
import { useSize } from "@/hooks/useSize";

const Product = () => {
  const { user } = useUser();
  const ROLE = user?.publicMetadata.role || "CUSTOMER";
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const currentPage = Number(searchParams.get("page"));
  const categoryParams = searchParams.get("category")?.split(",");
  const sizeParams = searchParams.get("size")?.split(",");
  const filterParams = searchParams.get("filter");
  const orderParams = searchParams.get("order");
  const searchTerm = searchParams.get("s") || "";
  const [debounceSearch] = useDebounce(searchTerm, 1000);

  const { data: warehouses } = useGetWarehouse();
  useEffect(() => {
    if (ROLE === "ADMIN" && warehouses && warehouses.length > 0) {
      setSearchParams((params) => {
        params.set("warehouse", String(warehouses[0].id));
        return params;
      });
    }
  }, [warehouses, ROLE]);
  const { data, isLoading } = useProducts({
    page: currentPage,
    s: debounceSearch,
    filter: filterParams || "",
    order: orderParams || "",
    limit: 10,
    status: searchParams.get("status") || "",
    size: searchParams.get("size") || "",
    category: searchParams.get("category") || "",
    warehouse: searchParams.get("warehouse") || "",
  });
  const { data: categories } = useCategories();
  const { data: sizes } = useSize();
  const categoriesOptions = categories
    ? categories.map((category) => ({
        value: category.id.toString(),
        label: category.name,
      }))
    : [];
  const sizesOptions = sizes
    ? sizes.map((size) => ({
        value: size.id.toString(),
        label: size.label,
      }))
    : [];

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
      <div className="flex gap-2 items-center justify-between">
        <div className="flex items-center gap-2 my-2">
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
          {sizesOptions.length > 0 && (
            <ReviewStatusCombobox
              title="Size"
              param="size"
              options={sizesOptions}
            />
          )}
          {categoriesOptions.length > 0 && (
            <ReviewStatusCombobox
              title="Category"
              param="category"
              options={categoriesOptions}
            />
          )}
          {(categoryParams || sizeParams) && (
            <Button
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("category");
                  params.delete("size");
                  return params;
                });
              }}
              variant="outline"
            >
              Reset <X className="w-4 h-4 ml-2" />
            </Button>
          )}
          {filterParams && orderParams && (
            <Button
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("order");
                  params.delete("filter");
                  return params;
                });
              }}
              variant="outline"
              className="uppercase"
            >
              {filterParams} {orderParams} <X className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        {ROLE === "ADMIN" && (
          <div className="flex gap-2 items-center">
            {warehouses && warehouses.length > 0 && (
              <Select
                value={searchParams.get("warehouse") || ""}
                onValueChange={(value) => {
                  setSearchParams((params) => {
                    params.set("warehouse", value);
                    return params;
                  });
                }}
              >
                <SelectTrigger className="flex justify-between items-center">
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem
                      key={warehouse.id}
                      value={warehouse.id.toString()}
                    >
                      <div className="flex items-center w-[300px] justify-between">
                        <span className="font-bold w-full self-start">
                          {warehouse.name}
                        </span>
                        <span className="flex items-center gap-2 text-center justify-end text-muted-foreground w-full">
                          <p className="overflow-hidden whitespace-nowrap text-ellipsis w-[100px]">
                            {
                              warehouse.warehouseAddress?.cityWarehouse
                                ?.cityName
                            }
                          </p>
                          <MapPin className="w-3 h-3 mr-2" />
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
      <div className="flex justify-end">
        <Select
          onValueChange={(value) => {
            setSearchParams((params) => {
              params.set("status", value);
              return params;
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
            <SelectItem value="DELETED">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="border rounded-md mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>
                <ChangeOrderButton paramKey="name" name="Name" />
              </TableHead>
              <TableHead>Available Size</TableHead>
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
              <TableHead className="w-[200px]">Description</TableHead>
              <TableHead className="text-center">Image</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center h-24">
                  <Loader2 className="animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {data && data.products && data.products.length > 0 ? (
                  <ProductTableRow products={data.products} />
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center h-24">
                      No Products
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
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
