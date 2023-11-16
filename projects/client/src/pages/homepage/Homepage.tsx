import React from "react"
import MainCarousel from "@/components/MainCarousel"
import { Link } from "react-router-dom"
import CategoryCard from "./CategoryCard"
import ProductCard from "@/components/ProductCard"
import TopProductCard from "@/components/TopProductCard"

const Homepage = () => {
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
          <div className="col-span-4 lg:col-span-4 row-span-2">
            <TopProductCard imageUrl="/placeholder/t-shirt-1.jpg" />
          </div>
          <div className="col-span-2 row-span-1">
            <TopProductCard size="sm" imageUrl="/placeholder/black-shirt.jpg" />
          </div>
          <div className="col-span-2 row-span-1">
            <TopProductCard size="sm" imageUrl="/placeholder/hoodie-1.jpg" />
          </div>
        </section>
        <h3 className="font-bold text-xl my-2 mt-8">Try our newest products</h3>
        <section className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-6 gap-2 gap-y-6">
          {Array(12)
            .fill(0)
            .map((v, i) => (
              <ProductCard
                key={i}
                product={{
                  name: "Black Shirt",
                  imageUrl: "/placeholder/black-shirt.jpg",
                  price: 1240000,
                  sell: 10,
                  stock: 123,
                  place: "jakarta",
                  rating: 4,
                }}
              />
            ))}
        </section>
      </div>
    </>
  )
}

export default Homepage
