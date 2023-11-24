import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({
  category,
  imageUrl,
}: {
  category: string;
  imageUrl: string;
}) => {
  return (
    <div className="w-full  rounded-lg overflow-hidden group">
      <Link to={`/category/${category}`} className="relative">
        <div className="w-full h-full bg-gradient-to-tr from-primary to-pink-300 shadow-sm text-base text-center lg:text-2xl p-2 py-6 font-bold text-primary-foreground ">
          {category}
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
