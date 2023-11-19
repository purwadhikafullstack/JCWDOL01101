import React, { useEffect } from "react";
import CategoryDropdown from "../components/CategoryDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";
import {
  Product,
  useHomeProducts,
  useProductInfinite,
} from "@/hooks/useProduct";
import ProductCard from "@/components/ProductCard";
import { useInView } from "react-intersection-observer";
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryPage = () => {
  const { ref, inView } = useInView();
  const [searchParams, setSearchParams] = useSearchParams({
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
    <>
      <img src="/carousel/ads.jpg" alt="ads banner" />
      <div className="w-full flex items-center justify-end my-4">
        <Select
          onValueChange={(value) => {
            setSearchParams((params) => {
              params.set("f", value);
              return params;
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="featured" placeholder="filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="lth">Lowest to Highest</SelectItem>
            <SelectItem value="htl">Highest to Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex lg:flex-row flex-col gap-4">
        <div className="w-full lg:w-[280px]">
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
        </div>
        <div className="pt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full">
          {isLoading ? (
            <NewestProductSekeleton product={10} />
          ) : (
            <>
              {isSuccess &&
                data.pages.map((page) =>
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
                )}
              {isFetchingNextPage && <NewestProductSekeleton product={5} />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
