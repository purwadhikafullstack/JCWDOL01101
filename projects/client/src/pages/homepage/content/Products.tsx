import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product, useProductInfinite } from "@/hooks/useProduct";
import { useInView } from "react-intersection-observer";
import ProductCard from "@/pages/homepage/components/ProductCard";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import Filter from "../components/products/Filter";
import { Helmet } from "react-helmet";
import FilterModal from "../components/products/FilterModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import SelectBy from "../components/products/SelectBy";

const ProductsPage = () => {
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const size = searchParams.get("size") || "";
  const pmin = searchParams.get("pmin") || "";
  const pmax = searchParams.get("pmax") || "";
  const f = searchParams.get("f") || "";
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProductInfinite({
    f,
    category,
    size,
    pmin,
    pmax,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

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
                {isSuccess &&
                  data.pages.map((page) => {
                    return page.length > 0 ? (
                      page.map((product: Product, i: number) => {
                        return page.length === i + 1 ? (
                          <ProductCard
                            ref={ref}
                            key={product.id}
                            product={product}
                          />
                        ) : (
                          <ProductCard key={product.id} product={product} />
                        );
                      })
                    ) : (
                      <div key={0} className="col-span-5">
                        <img
                          className="w-[400px] mx-auto"
                          src="ilus/empty-product.svg"
                          alt="empty product"
                        />
                      </div>
                    );
                  })}
                {isFetchingNextPage && <NewestProductSekeleton product={5} />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
