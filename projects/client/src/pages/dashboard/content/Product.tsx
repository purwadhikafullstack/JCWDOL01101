import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { MapPin, Plus, SearchIcon, X } from "lucide-react";
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
import { useCurrentUser, useUsers } from "@/hooks/useUser"
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

const Product = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const ROLE = user?.publicMetadata.role || "CUSTOMER";
  const userId = user?.publicMetadata.id;
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const currentPage = Number(searchParams.get("page"));
  const categoryParams = searchParams.get("category")?.split(",");
  const filterParams = searchParams.get("filter");
  const orderParams = searchParams.get("order");
  const searchTerm = searchParams.get("s") || "";
  const [debounceSearch] = useDebounce(searchTerm, 1000);

  const [selectedWarehouse, setSelectedWarehouse] = useState('')

  const { data: warehouses } = useGetWarehouse();
  const { data, isLoading } = useProducts({
    page: currentPage,
    s: debounceSearch,
    filter: filterParams || "",
    order: orderParams || "",
    limit: 10,
    category: searchParams.get("category") || "",
    warehouse: searchParams.get("warehouse") || "",
  });
  const { data: categories } = useCategories();
  const categoriesOptions = categories
    ? categories.map((category) => ({
        value: category.id.toString(),
        label: category.name,
      }))
    : [];

  const clearImage = useBoundStore((state) => state.clearImage);
  useEffect(() => {
    clearImage();
  }, []);

  const { data: userAdmin } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  })

  // useEffect(() => {
  //   // Jika selectedWarehouse belum ditetapkan, atur ke ID gudang dengan ID terendah
  //   if (!selectedWarehouse && warehouses && warehouses.length > 0) {
  //     const defaultWarehouse = warehouses.reduce((min, warehouse) => warehouse.id < min.id ? warehouse : min, warehouses[0]);
  //     setSelectedWarehouse(defaultWarehouse.id.toString());
  //   }
  // }, [warehouses, selectedWarehouse]);

  useEffect(() => {
    if (ROLE === "WAREHOUSE ADMIN" && warehouses && warehouses.length > 0 && user) {
      const userWarehouse = warehouses.find(warehouse => warehouse.userId === Number(userAdmin?.id));
      if (userWarehouse) {
        setSelectedWarehouse(userWarehouse.id.toString());
        setSearchParams((params) => {
          params.set("warehouse", userWarehouse.id.toString());
          return params;
        });
      }
    } else  //untuk super admin agar ga N/A ketika belum milih warehouse
    if (!selectedWarehouse && warehouses && warehouses.length > 0) {
      const defaultWarehouse = warehouses.reduce((min, warehouse) => warehouse.id < min.id ? warehouse : min, warehouses[0]);
      setSelectedWarehouse(defaultWarehouse.id.toString());
    }
  }, [warehouses, selectedWarehouse, user, ROLE, setSearchParams]);

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
          {categoriesOptions.length > 0 && (
            <ReviewStatusCombobox
              title="Category"
              param="category"
              options={categoriesOptions}
            />
          )}
          {categoryParams && (
            <Button
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("category");
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
                defaultValue={warehouses ? warehouses[0].id.toString() : ""}
                onValueChange={(value) => {
                  setSearchParams((params) => {
                    params.set("warehouse", value);
                    return params;
                  });
                  setSelectedWarehouse(value);
                }
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id.toString()} value={warehouse.id.toString()}>
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
                <TableHead className="w-[200px]">Description</TableHead>
                <TableHead className="text-center">Image</TableHead>
                {(ROLE === "ADMIN"||"WAREHOUSE ADMIN") && (
                  <TableHead className="text-center">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.products && data.products.length > 0 ? (
                <ProductTableRow products={data.products} selectedWarehouse={selectedWarehouse} />
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
