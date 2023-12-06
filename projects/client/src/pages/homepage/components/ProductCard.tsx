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
import { CheckSquare, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useGetClosestWarehouse } from "@/hooks/useWarehouse";
import { Coordinates } from "./checkout/AddAddressForm";
import { useBoundStore } from "@/store/client/useStore";

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
          <div className="rounded-md shadow-sm border overflow-hidden">
            <LazyLoadImage
              className="w-full h-[200px] object-cover"
              src={`${baseURL}/images/${product.productImage[0].image}`}
              effect="opacity"
              alt={product.name}
            />
            <div className="flex flex-col gap-2 text-sm p-2">
              <p className="whitespace-nowrap overflow-hidden m-0 text-ellipsis p-0">
                {product.name}
              </p>
              <span>
                <p className="font-bold">
                  {formatToIDR(product.price.toString())}
                </p>
              </span>
              {closestWarehouse && (
                <div>
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <p>{closestWarehouse.name}</p>
                  </span>
                  <span className="text-muted-foreground text-xs flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <p>
                      {
                        closestWarehouse.warehouseAddress?.cityWarehouse
                          ?.cityName
                      }
                    </p>
                  </span>
                </div>
              )}
              <span className="text-muted-foreground lg:flex items-center gap-2 hidden">
                <p className="text-xs">
                  {stock} items left | {sold} sold
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
