import { buttonVariants } from "@/components/ui/button";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import React from "react";
import { Link, useParams } from "react-router-dom";

type Props = {
  product: Product;
  totalStock: number;
  totalSold: number;
};

const ReviewProduct = ({ product, totalSold, totalStock }: Props) => {
  const { slug } = useParams();
  return (
    <div className="w-[450px]">
      <div className="sticky top-[180px]">
        <div className="px-2 space-y-4">
          <img
            alt={product.name}
            src={`${baseURL}/images/${product.primaryImage}`}
          />
          <div className="space-y-2">
            <p className="font-bold text-lg">{product.name}</p>
            <p className="text-sm">{product.description}</p>
            <span className="text-lg font-bold">
              {formatToIDR(product.price)}
            </span>
            <p className="">STOCK: {totalStock}</p>
            <p className="">SOLD: {totalSold}</p>
            <Link
              to={`/dashboard/product/edit/${slug}`}
              className={buttonVariants({
                variant: "outline",
                className: "w-ful md:border-black dark:border-border w-full",
              })}
            >
              Edit This Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewProduct;
