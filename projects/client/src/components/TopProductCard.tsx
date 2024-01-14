import React from "react";
import { baseURL } from "@/service";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn, convertToK, formatToIDR } from "@/lib/utils";
import { Product } from "@/hooks/useProduct";

type Props = {
  product: Product;
  size?: string;
  index: number;
};
const TopProductCard = ({ product, size, index }: Props) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="relative block aspect-square h-full w-full"
    >
      <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg  border bg-background hover:border-primary relative border-muted ">
        <img
          className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
          src={`${baseURL}/images/${product.primaryImage}`}
          alt="black shirt"
        />
        <div className="absolute top-0 left-0 p-2 lg:p-4">
          <div className="px-2 lg:p-2 rounded-lg flex items-center justify-center bg-primary  w-full text-primary-foreground text-sm lg:text-base lg:font-semibold">
            <Crown className="lg:mr-2 h-5 w-5 hidden lg:block" />
            <span>#{index + 1}</span>
          </div>
        </div>
        <div className="absolute bottom-0 w-full  overflow-hidden  flex transform translate-y-1 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex flex-col items-start px-2 pb-4 justify-center w-full text-xs text-foreground">
            <div className="justify-between flex  bg-black/80 p-2 backdrop-blur-sm  items-center pl-4 font-semibold rounded-lg">
              <h3 className="line-clamp-1 lg:line-clamp-2 text-xs lg:text-lg flex-grow text-background dark:text-foreground mr-2 leading-none tracking-tight">
                {product.name}
              </h3>
              <span
                className={cn(
                  "flex-none bg-primary text-primary-foreground rounded-md",
                  size === "sm" ? "text-xs px-2 lg:p-2" : "text-sm p-2"
                )}
              >
                {size === "sm" ? (
                  <>
                    <p className="lg:hidden block">
                      {convertToK(product.price)}
                    </p>
                    <p className="hidden lg:block">
                      {formatToIDR(product.price)}
                    </p>
                  </>
                ) : (
                  <>{formatToIDR(product.price)}</>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TopProductCard;
