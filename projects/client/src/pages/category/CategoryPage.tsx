import React from "react";
import CategoryDropdown from "./CategoryDropdown";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CategoryPage = () => {
  return (
    <>
      <img src="/carousel/ads.jpg" alt="ads banner" />
      <div className="flex lg:flex-row flex-col gap-4 mt-8">
        <div className="w-full lg:w-[280px]">
          <h3 className="uppercase tracking-wide font-bold text-lg">
            All Category
          </h3>
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
        <div className="flex flex-1 flex-col justify-end items-end">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue defaultValue="featured" placeholder="filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured Product</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="lth">Lowest to Highest</SelectItem>
              <SelectItem value="htl">Highest to Lowest</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
            </SelectContent>
          </Select>
          <div className="pt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
