import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SearchIcon, X, MapPin, ArchiveRestore, Loader2 } from "lucide-react";
import ReviewStatusCombobox from "../ReviewStatusCombobox";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "@/hooks/useCategory";
import { useSize } from "@/hooks/useSize";
import { useUser } from "@clerk/clerk-react";
import { Warehouse } from "@/hooks/useWarehouse";
import Hashids from "hashids";
import { useChangeAllStatus } from "@/hooks/useProductMutation";
import { STATUS } from "@/hooks/useReviewMutation";
import { useProducts } from "@/hooks/useProduct";
import { useDebounce } from "use-debounce";

type Props = {
  warehouses?: Warehouse[];
};
const ProductTableOptions = ({ warehouses }: Props) => {
  const { user } = useUser();
  const hashids = new Hashids("TOTEN", 10);
  const ROLE = user?.publicMetadata.role || "CUSTOMER";
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("s") || "";
  const categoryParams = searchParams.get("category")?.split(",");
  const sizeParams = searchParams.get("size")?.split(",");
  const orderParams = searchParams.get("order");
  const currentPage = Number(searchParams.get("page"));
  const filterParams = searchParams.get("filter");
  const [debounceSearch] = useDebounce(searchTerm, 1000);

  const { data } = useProducts({
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

  const changeAllStatusMutation = useChangeAllStatus();
  const status = searchParams.get("status") as STATUS;
  const warehouse = searchParams.get("warehouse");
  const handleRestoreAllProduct = () => {
    if (status !== "ACTIVE" && warehouse) {
      const decodedWarehouseId = Number(hashids.decode(warehouse));
      changeAllStatusMutation.mutate({
        warehouseId: decodedWarehouseId,
        status: "ACTIVE",
        previousStatus: status,
      });
    }
  };
  return (
    <>
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
                  {warehouses.map((warehouse) => {
                    const hashId = hashids.encode(Number(warehouse.id));
                    return (
                      <SelectItem key={warehouse.id} value={hashId}>
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
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 justify-end">
        {status && status !== "ACTIVE" && ROLE === "ADMIN" && data && (
          <Button
            disabled={data.products.length <= 0}
            onClick={handleRestoreAllProduct}
            variant="outline"
          >
            <Loader2
              className={
                changeAllStatusMutation.isPending
                  ? "animate-spin w-4 h-4 mr-2"
                  : "hidden"
              }
            />
            <ArchiveRestore className="w-4 h-4 mr-2" />
            Restore All
          </Button>
        )}
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
    </>
  );
};

export default ProductTableOptions;
