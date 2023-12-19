import React, { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProduct";
import { useDebounce } from "use-debounce";
import ProductTableRow from "../components/ProductTableRow";
import TablePagination from "../components/TablePagination";
import ChangeOrderButton from "../components/ChangeOrderButton";
import { useUser } from "@clerk/clerk-react";
import { useCurrentUser, useUsers } from "@/hooks/useUser";
import { useBoundStore } from "@/store/client/useStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetWarehouse } from "@/hooks/useWarehouse";
import ProductTableOptions from "../components/product/ProductTableOptions";
import { Helmet } from "react-helmet";

const Product = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const ROLE = user?.publicMetadata.role || "CUSTOMER";
  const userId = user?.publicMetadata.id;
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const currentPage = Number(searchParams.get("page"));
  const filterParams = searchParams.get("filter");
  const orderParams = searchParams.get("order");
  const searchTerm = searchParams.get("s") || "";
  const [debounceSearch] = useDebounce(searchTerm, 1000);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
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

  const clearImage = useBoundStore((state) => state.clearImage);
  useEffect(() => {
    clearImage();
  }, []);

  const { data: userAdmin } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  });

  useEffect(() => {
    if (
      ROLE === "WAREHOUSE ADMIN" &&
      warehouses &&
      warehouses.length > 0 &&
      user
    ) {
      const userWarehouse = warehouses.find(
        (warehouse) => warehouse.userId === Number(userAdmin?.id)
      );
      if (userWarehouse) {
        setSelectedWarehouse(userWarehouse.id.toString());
        setSearchParams((params) => {
          params.set("warehouse", userWarehouse.id.toString());
          return params;
        });
      }
    } else if (!selectedWarehouse && warehouses && warehouses.length > 0) {
      const defaultWarehouse = warehouses.reduce(
        (min, warehouse) => (warehouse.id < min.id ? warehouse : min),
        warehouses[0]
      );
      setSelectedWarehouse(defaultWarehouse.id.toString());
    }
  }, [warehouses, selectedWarehouse, user, ROLE, setSearchParams]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Products</title>
      </Helmet>
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
        <ProductTableOptions warehouses={warehouses} />
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
                {(ROLE === "ADMIN" || "WAREHOUSE ADMIN") && (
                  <TableHead className="text-center">Action</TableHead>
                )}
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
                    <ProductTableRow
                      products={data.products}
                      selectedWarehouse={selectedWarehouse}
                    />
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
    </>
  );
};

export default Product;
