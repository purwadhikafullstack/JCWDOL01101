import React from "react";
import { baseURL } from "@/service";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn, convertToK, formatToIDR } from "@/lib/utils";
import { Product } from "@/hooks/useProduct";

type TopProductCardProps = {
  product: Product;
  size?: string;
};
const TopProductCard = ({ product, size }: TopProductCardProps) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="relative block aspect-square h-full w-full"
    >
      <div className="group flex h-full w-full items-center justify-center overflow-hidden  border bg-background hover:border-primary relative border-muted ">
        <img
          className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
          src={`${baseURL}/images/${product.primaryImage}`}
          alt="black shirt"
        />
        <div className="absolute top-0 left-0 p-4">
          <div className="px-2 lg:p-2 flex items-center justify-center bg-primary rounded-full w-full text-primary-foreground text-sm lg:text-base lg:font-semibold">
            <Crown className="lg:mr-2 h-5 w-5" />
            <span className="hidden lg:block">Top Seller</span>
          </div>
        </div>
        <div className="absolute bottom-0 w-full  overflow-hidden  flex transform translate-y-1 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex flex-col items-start pl-2 pb-4 justify-center w-full text-xs text-foreground">
            <div
              className={cn(
                "justify-between flex  bg-black/80 p-2 backdrop-blur-sm rounded-full items-center pl-4 font-semibold",
                size === "sm" ? "" : "flex"
              )}
            >
              <h3
                className={`${
                  size === "sm" &&
                  "max-w-[60px] lg:max-w-[150px] overflow-hidden whitespace-nowrap text-ellipsis"
                }
                 lg:line-clamp-2 text-xs lg:text-lg  flex-grow text-background dark:text-foreground mr-2 leading-none tracking-tight`}
              >
                {product.name}
              </h3>
              <span
                className={`${
                  size === "sm" ? "text-xs px-2 lg:p-2" : "text-sm p-2"
                } flex-none rounded-full bg-primary  text-primary-foreground`}
              >
                {size === "sm" ? (
                  <>
                    <p className="lg:hidden block">
                      {convertToK(product.price)}
                    </p>
                    <p className="hidden lg:block">
                      {formatToIDR(product.price.toString())}
                    </p>
                  </>
                ) : (
                  <>{formatToIDR(product.price.toString())}</>
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
