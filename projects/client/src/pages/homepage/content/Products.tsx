import React from "react";
import { useSearchParams } from "react-router-dom";
import { Product, useProductInfinite } from "@/hooks/useProduct";
import ProductCard from "@/pages/homepage/components/ProductCard";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import Filter from "../components/products/Filter";
import { Helmet } from "react-helmet";
import FilterModal from "../components/products/FilterModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SelectBy from "../components/products/SelectBy";
import { Button } from "@/components/ui/button";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const size = searchParams.get("size") || "";
  const pmin = searchParams.get("pmin") || "";
  const pmax = searchParams.get("pmax") || "";
  const f = searchParams.get("f") || "";
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useProductInfinite({
      f,
      category,
      size,
      pmin,
      pmax,
      limit: 10,
    });

  return (
    <>
      <Helmet>
        <title>All Products | TOTEN</title>
      </Helmet>
      <img
        src="/carousel/ads.jpg"
        alt="ads banner"
        className="h-[150px] md:h-max object-contain rounded-lg object-left"
      />
      <div className="my-2 hidden md:block">
        <SelectBy />
      </div>
      <div className="flex flex-col md:flex-row gap-4 ">
        {isDesktop ? (
          <div className="w-[280px] relative">
            <div className="sticky top-[120px]">
              <Filter />
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-2 my-2">
            <FilterModal />
            <SelectBy />
          </div>
        )}
        <div className="flex-1">
          <div className="pt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full product_items">
            {isLoading ? (
              <NewestProductSekeleton product={5} />
            ) : (
              <>
                {data &&
                  data.pages.map((page) => {
                    return page.length > 0 ? (
                      page.map((product: Product, i: number) => (
                        <ProductCard key={product.id} product={product} />
                      ))
                    ) : (
                      <div className="col-span-2 md:col-span-4 lg:col-span-5">
                        <img
                          className=" w-[300px] md:w-[400px] mx-auto"
                          src="ilus/empty-product.svg"
                          alt="empty product"
                        />
                      </div>
                    );
                  })}
              </>
            )}
          </div>

          <div className="flex justify-center w-full my-4">
            {hasNextPage && (
              <Button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                variant="outline"
                className="border-black dark:border-border rounded-none w-max mx-auto md:px-20"
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Load More"
                  : "nothing more to load"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
