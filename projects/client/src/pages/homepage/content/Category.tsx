import React, { useEffect } from "react";
import CategoryDropdown from "../components/CategoryDropdown";
import { Link, useSearchParams } from "react-router-dom";
import { Product, useProductInfinite } from "@/hooks/useProduct";
import ProductCard from "@/pages/homepage/components/ProductCard";
import { useInView } from "react-intersection-observer";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import Filter from "../components/Filter";

const CategoryPage = () => {
  const { ref, inView } = useInView();
  const [searchParams] = useSearchParams({
    s: "all",
  });
  const s = searchParams.get("s") || "all";
  const f = searchParams.get("f") || "";

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProductInfinite({
    s,
    f,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  return (
    <div className="category-products">
      <div className="product_banner">
        <img src="/carousel/ads.jpg" alt="ads banner" />
      </div>
      <div className="w-full flex items-center justify-end my-4   product_filter ">
        <div className="sticky top-[100px]"></div>
      </div>
      <div className="w-full lg:w-[280px] product_side">
        <div className="sticky pt-10 md:pt-0 lg:top-[100px]">
          <Link to="/category?s=all" className="uppercase tracking-wide">
            All Products
          </Link>
          <CategoryDropdown title="Men's Clothing">
            <ul>
              <li>T shirt</li>
              <li>Jacket</li>
            </ul>
          </CategoryDropdown>
          <CategoryDropdown title="Wowen Apparel">
            <ul>
              <li>Women</li>
              <li>Jacket</li>
            </ul>
          </CategoryDropdown>
          <Filter />
        </div>
      </div>
      <div className="pt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full product_items">
        {isLoading ? (
          <NewestProductSekeleton product={10} />
        ) : (
          <>
            {isSuccess &&
              data.pages.map((page) =>
                page.map((product: Product, i: number) => {
                  return page.length === i + 1 ? (
                    <ProductCard ref={ref} key={product.id} product={product} />
                  ) : (
                    <ProductCard key={product.id} product={product} />
                  );
                })
              )}
            {isFetchingNextPage && <NewestProductSekeleton product={5} />}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
