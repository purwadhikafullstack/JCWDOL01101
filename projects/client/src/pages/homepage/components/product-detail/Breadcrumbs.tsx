import { useProduct } from "@/hooks/useProduct";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";

const Breadcrumbs = () => {
  const { slug } = useParams();
  const { data: pd } = useProduct(slug || "");
  return (
    pd && (
      <div>
        <span className="flex gap-1 text-xs group items-center mb-4 cursor-pointer">
          <Link to="/" className="text-primary">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link to="/products" className="text-primary">
            Product
          </Link>
          {pd.product.productCategory && (
            <>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link
                to={`/products?category=${pd.product.productCategory.slug}`}
                className="text-primary"
              >
                {pd.product.productCategory.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link
            to={`/product/${slug}`}
            className=" overflow-hidden text-ellipsis whitespace-nowrap w-[100px]  lg:w-[350px] group-hover:w-max"
          >
            {pd.product.name}
          </Link>
        </span>
      </div>
    )
  );
};

export default Breadcrumbs;
