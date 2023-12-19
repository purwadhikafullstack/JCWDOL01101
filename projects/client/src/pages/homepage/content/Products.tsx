import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product, useProductInfinite } from "@/hooks/useProduct";
import { useInView } from "react-intersection-observer";
import ProductCard from "@/pages/homepage/components/ProductCard";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import Filter from "../components/products/Filter";
import { useCategories } from "@/hooks/useCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import ActiveFilter from "../components/products/ActiveFilter";
import { Helmet } from "react-helmet";

const ProductsPage = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useCategories();
  const category = searchParams.get("category") || "";
  const size = searchParams.get("size") || "";
  const pmin = searchParams.get("pmin") || "";
  const pmax = searchParams.get("pmax") || "";
  const f = searchParams.get("f") || "";

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
      <div className="category-products">
        <div className="product_banner">
          <img src="/carousel/ads.jpg" alt="ads banner" />
        </div>
        <ActiveFilter />
        <div className="w-full lg:w-[280px] product_side">
          <div className="sticky pt-2 lg:pt-2 md:pt-0 lg:top-[100px]">
            <div className="flex gap-2 items-center justify-between my-2">
              <Label className="uppercase tracking-wide">
                {t("productsPage.category")}
              </Label>
              {!!category && (
                <Button
                  onClick={() => {
                    setSearchParams((params) => {
                      params.delete("category");
                      return params;
                    });
                  }}
                  variant="ghost"
                  size="sm"
                  className="font-bold uppercase h-8"
                >
                  {t("productsPage.clear")}
                </Button>
              )}
            </div>
            <Select
              onValueChange={(value) => {
                setSearchParams((params) => {
                  params.set("category", value);
                  return params;
                });
              }}
            >
              <SelectTrigger className="w-full rounded-none">
                <SelectValue placeholder={t("productsPage.category")} />
              </SelectTrigger>
              {categories && categories.length > 0 && (
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
            <Filter />
          </div>
        </div>
        <div className="pt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full product_items">
          {isLoading ? (
            <NewestProductSekeleton product={10} />
          ) : (
            <>
              {isSuccess && data.pages.length > 0 ? (
                data.pages.map((page, i) =>
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
                )
              ) : (
                <div className="col-span-5">
                  <img
                    className="w-[400px] mx-auto"
                    src="ilus/empty-product.svg"
                    alt="empty product"
                  />
                </div>
              )}
              {isFetchingNextPage && <NewestProductSekeleton product={5} />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
