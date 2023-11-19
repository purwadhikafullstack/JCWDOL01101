import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const CategoryCard = ({
  category,
  imageUrl,
}: {
  category: string;
  imageUrl: string;
}) => {
  return (
    <div className="w-full h-full rounded-lg max-h-[320px] overflow-hidden group">
      <Link to={`/category/${category}`} className="relative">
        <LazyLoadImage
          className="w-full h-full object-cover rounded-lg relative  transition duration-300 ease-in-out group-hover:scale-105"
          src={imageUrl}
          alt={category}
        />
        <div className="w-full h-full bg-blue-400">
          <span className="absolute top-0 left-0 px-[5%] py-[10%] font-bold text-primary-foreground text-sm md:text-xl">
            {category}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
