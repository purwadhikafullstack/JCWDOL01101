import React from "react";
import MainCarousel from "@/components/MainCarousel";
import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "@/pages/homepage/components/ProductCard";
import TopProductCard from "@/components/TopProductCard";
import { useHighestSellProducts, useProductUrl } from "@/hooks/useProduct";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import HighestSellSkeleton from "@/components/skeleton/HighestSellSkeleton";
import { useCategories } from "@/hooks/useCategory";
import { useTranslation } from "react-i18next";

const Homepage = () => {
  const { t } = useTranslation();
  const { data: newestProducts, isLoading } = useProductUrl({
    key: ["new-products"],
    url: "/products/new",
  });
  const { data: categories } = useCategories(6);
  const { data: highestSell, isLoading: highestSellLoading } =
    useHighestSellProducts();
  return (
    <>
      <MainCarousel />
      <div className="mt-2 flex flex-col">
        <span className="flex items-center justify-between mt-8 my-2 capitalize">
          <h3 className="font-bold text-base lg:text-xl">
            {t("homepage.title1")}
          </h3>
          <Link
            to="/products"
            className="text-primary text-xs md:text-sm font-bold"
          >
            {t("homepage.sub1")}
          </Link>
        </span>
        <section className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {categories &&
            categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
        </section>
        <span className="flex items-center justify-between mt-8 my-2">
          <h3 className="font-bold text-base lg:text-xl capitalize">
            {t("homepage.title2")}
          </h3>
          <Link
            to="/search?sell=highest"
            className="text-primary text-xs md:text-sm font-bold"
          >
            {t("homepage.sub2")}
          </Link>
        </span>
        {highestSellLoading ? (
          <HighestSellSkeleton />
        ) : (
          <section className="grid grid-cols-4 lg:grid-cols-6 gap-4">
            {highestSell?.map((product, i) => (
              <div
                key={product.id}
                className={
                  i === 0
                    ? `col-span-4 lg:col-span-4 row-span-2`
                    : "col-span-2 row-span-1"
                }
              >
                <TopProductCard size={i !== 0 ? "sm" : ""} product={product} />
              </div>
            ))}
          </section>
        )}
        <h3 className="font-bold text-xl my-2 mt-8 case capitalize">
          {t("homepage.title3")}
        </h3>
        <section className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-6 gap-2 gap-y-6">
          {isLoading ? (
            <NewestProductSekeleton product={6} />
          ) : (
            <>
              {newestProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Homepage;
