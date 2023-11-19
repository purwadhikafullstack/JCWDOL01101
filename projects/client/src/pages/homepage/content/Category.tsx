import React from "react";
import CategoryDropdown from "../components/CategoryDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";
import { useHomeProducts } from "@/hooks/useProduct";
import ProductCard from "@/components/ProductCard";

const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    s: "all",
  });
  const s = searchParams.get("s") || "all";
  const f = searchParams.get("f") || "";

  const { data } = useHomeProducts({ s, f });

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
        <div className="flex flex-1 flex-col justify-end items-end">
          <div className="pt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {data?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
