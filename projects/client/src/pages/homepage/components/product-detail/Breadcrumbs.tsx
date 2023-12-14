import { Category } from "@/hooks/useProduct";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

type BreadcrumbsProps = {
  slug: string;
  categoryId: number;
  category: Category;
  productName: string;
};

const Breadcrumbs = ({
  slug,
  categoryId,
  productName,
  category,
}: BreadcrumbsProps) => {
  return (
    <div>
      <span className="flex gap-1 text-xs group items-center mb-4 cursor-pointer">
        <Link to="/" className="text-primary">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <Link to="/products" className="text-primary">
          Product
        </Link>
        {category && (
          <>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link
              to={`/products?category=${category.slug}`}
              className="text-primary"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <Link
          to={`/product/${slug}`}
          className=" overflow-hidden text-ellipsis whitespace-nowrap w-[100px]  lg:w-[350px] group-hover:w-max"
        >
          {productName}
        </Link>
      </span>
    </div>
  );
};

export default Breadcrumbs;
