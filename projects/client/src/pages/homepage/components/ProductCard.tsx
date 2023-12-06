import React, {
  HTMLAttributes,
  Ref,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { CheckSquare, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useGetClosestWarehouse } from "@/hooks/useWarehouse";
import { Coordinates } from "./checkout/AddAddressForm";
import { useBoundStore } from "@/store/client/useStore";
import Review from "./Review";

interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: Product;
}
const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, ...props }, ref: Ref<HTMLDivElement>) => {
    const { stock, sold } = product
      ? product.inventory.reduce(
          (prev, curr) => ({
            stock: prev.stock + curr.stock,
            sold: prev.sold + curr.sold,
          }),
          { stock: 0, sold: 0 }
        )
      : { stock: 0, sold: 0 };
    const location = useBoundStore((state) => state.location);
    const { data: closestWarehouse } = useGetClosestWarehouse({
      lat: location?.lat,
      lng: location?.lng,
    });

    const productContent = (
      <>
        <Link to={`/product/${product.slug}`}>
          <div className=" shadow-sm overflow-hidden relative">
            <span
              className="absolute top-0 right-0 p-2 "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart />
            </span>
            <LazyLoadImage
              className="object-cover"
              src={`${baseURL}/images/${product.primaryImage}`}
              effect="opacity"
              alt={product.name}
            />
            <div className="flex flex-col gap-2 text-sm p-2">
              <div className="flex justify-between text-xs items-center font-bold text-muted-foreground">
                <span className="uppercase text-sm">
                  {product.productCategory?.name}
                </span>
                <span>{product.size}</span>
              </div>
              <p className="font-bold">{product.name}</p>
              <span>
                <p className="font-bold text-xl">
                  {formatToIDR(product.price.toString())}
                </p>
              </span>
            </div>
          </div>
        </Link>
      </>
    );
    return ref ? (
      <div ref={ref}>{productContent}</div>
    ) : (
      <div>{productContent}</div>
    );
  }
);

export default ProductCard;
