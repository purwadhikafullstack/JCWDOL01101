import { Category } from "@/hooks/useProduct";
import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <div className="w-full  rounded-lg overflow-hidden group">
      <Link to={`/products?category=${category.id}`} className="relative">
        <div
          style={{
            backgroundImage: `linear-gradient(to bottom right , ${category.color}, ${category.color}40)`,
          }}
          className={`w-full h-full  shadow-sm text-base text-center lg:text-xl p-2 py-6 font-bold text-primary-foreground `}
        >
          {category.name}
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
