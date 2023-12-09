import React, { HTMLAttributes, Ref, forwardRef } from "react";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useReviewByProduct } from "@/hooks/useReview";
import ReviewStar from "./product-detail/ReviewStar";

interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: Product;
}
const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, ...props }, ref: Ref<HTMLDivElement>) => {
    const { data: reviewData } = useReviewByProduct(product?.id);

    const productContent = (
      <>
        <Link to={`/product/${product.slug}`}>
          <div className=" shadow-sm overflow-hidden relative h-full">
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
              {reviewData && reviewData.reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <ReviewStar rating={reviewData.averageRating} />
                  <span>({reviewData.totalReviews || 0})</span>
                </div>
              )}
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
