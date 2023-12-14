import { Category } from "@/hooks/useProduct";
import { baseURL } from "@/service";
import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <div>
      <Link to={`/products?category=${category.slug}`} className="relative">
        <img src={`${baseURL}/images/${category.image}`} />
        <p className="text-center text-sm md:text-base  mt-2 capitalize">
          {category.name}
        </p>
      </Link>
    </div>
  );
};

export default CategoryCard;
