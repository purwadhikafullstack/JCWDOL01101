import React from "react";
import MainCarousel from "@/components/MainCarousel";
import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import TopProductCard from "@/components/TopProductCard";
import { useProductUrl } from "@/hooks/useProduct";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";

const Homepage = () => {
  const { data: newestProducts, isLoading } = useProductUrl({
    key: ["new-products"],
    url: "/new-products",
  });
  // TODO: add skeletoon to highest sell product
  const { data: highestSell, isLoading: highestSellLoading } = useProductUrl({
    key: ["highest-sell"],
    url: "/highest-sell",
  });
  return (
    <>
      <MainCarousel />
      <div className="mt-2 flex flex-col">
        <span className="flex items-center justify-between mt-8 my-2">
          <h3 className="font-bold text-base lg:text-xl">Popular Category</h3>
          <Link
            to="/category"
            className="text-primary text-xs md:text-sm font-bold"
          >
            See All Category
          </Link>
        </span>
        <section className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Array(6)
            .fill(0)
            .map((v, i) => (
              <CategoryCard
                key={i}
                imageUrl="/placeholder/man.jpg"
                category="Men's Fashion"
              />
            ))}
        </section>
        <span className="flex items-center justify-between mt-8 my-2">
          <h3 className="font-bold text-base lg:text-xl">
            Top Seller this Month
          </h3>
          <Link
            to="/search?sell=highest"
            className="text-primary text-xs md:text-sm font-bold"
          >
            See All
          </Link>
        </span>
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
              <TopProductCard
                size={i !== 0 ? "sm" : ""}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            </div>
          ))}
        </section>
        <h3 className="font-bold text-xl my-2 mt-8">Try our newest products</h3>
        {isLoading ? (
          <NewestProductSekeleton product={12} />
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-6 gap-2 gap-y-6">
            {newestProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </div>
    </>
  );
};

export default Homepage;
