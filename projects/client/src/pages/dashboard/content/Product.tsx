import React, { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
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
import { useBoundStore } from "@/store/client/useStore";
import { useGetWarehouse } from "@/hooks/useWarehouse";
import { Helmet } from "react-helmet";
import Hashids from "hashids";
import { useCurrentUser } from "@/hooks/useUser";
import ProductTableOptions from "../components/product/ProductTableOptions";

const Product = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const hashids = new Hashids("TOTEN", 10);
  const ROLE = user?.publicMetadata.role || "CUSTOMER";
  const { data: curentUser } = useCurrentUser({
    externalId: user?.id,
    enabled: isLoaded && !!isSignedIn,
  });

  useEffect(() => {
    if (ROLE === "WAREHOUSE ADMIN" && curentUser) {
      setSearchParams((params) => {
        const hashId = hashids.encode(curentUser.userData.id);
        params.set("warehouse", hashId);
        return params;
      });
    }
  }, [curentUser, ROLE]);

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });

  const currentPage = Number(searchParams.get("page"));
  const filterParams = searchParams.get("filter");
  const orderParams = searchParams.get("order");
  const searchTerm = searchParams.get("s") || "";
  const [debounceSearch] = useDebounce(searchTerm, 1000);
  const { data: warehouses } = useGetWarehouse(ROLE === "ADMIN");
  const warehouseId = searchParams.get("warehouse");

  useEffect(() => {
    if (
      !warehouseId &&
      ROLE === "ADMIN" &&
      warehouses &&
      warehouses.length > 0
    ) {
      setSearchParams((params) => {
        const hashId = hashids.encode(warehouses[0].id);
        params.set("warehouse", hashId);
        return params;
      });
    }
  }, [warehouses, ROLE, warehouseId]);

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
                <TableHead className="w-[100px] text-start">
                  Available Size
                </TableHead>
                <TableHead className="w-[150px]">
                  <ChangeOrderButton paramKey="price" name="Price" />
                </TableHead>
                <TableHead className="w-[150px] text-center">
                  <ChangeOrderButton paramKey="weight" name="Weight (grams)" />
                </TableHead>
                <TableHead className="w-[120px] text-center">
                  Total Stock
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Total Sold
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  Category
                </TableHead>
                <TableHead className="w-[200px]">Description</TableHead>
                <TableHead className="text-center">Image</TableHead>
                {(ROLE === "ADMIN" || ROLE === "WAREHOUSE ADMIN") && (
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
    </>
  );
};

export default Product;
