import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

type BreadcrumbsProps = {
  slug: string;
  categoryId: number;
  categoryName: string;
  productName: string;
};

const Breadcrumbs = ({
  slug,
  categoryId,
  productName,
  categoryName,
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
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <Link to={`/products?category=${categoryId}`} className="text-primary">
          {categoryName}
        </Link>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <Link
          to={`/product/${slug}`}
          className=" overflow-hidden text-ellipsis whitespace-nowrap  w-[350px] group-hover:w-max"
        >
          {productName}
        </Link>
      </span>
    </div>
  );
};

export default Breadcrumbs;
