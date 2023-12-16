import React, { HTMLAttributes, Ref, forwardRef } from "react";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useReviewByProduct } from "@/hooks/useReview";
import ReviewStar from "./product-detail/ReviewStar";
import { useToggleWishlist } from "@/hooks/useWishlistMutation";
import { motion } from "framer-motion";
import { Size } from "@/hooks/useSize";

interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  product: Product;
}
const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, ...props }, ref: Ref<HTMLDivElement>) => {
    const { data: reviewData } = useReviewByProduct(product?.id);
    const wishlistMutation = useToggleWishlist();
    const sizes = product.inventory.map((inv) => inv.sizes).flat() as Size[];

    const { low, high } = sizes.reduce(
      (acc, size) => {
        if (size.value < acc.low.value) {
          acc.low = size;
        }
        if (size.value > acc.high.value) {
          acc.high = size;
        }
        return acc;
      },
      { low: sizes[0], high: sizes[0] }
    );

    let lowLabel = low.label;
    let highLabel = high.label;

    const productContent = (
      <>
        <Link to={`/product/${product.slug}`}>
          <div className="flex flex-col flex-auto shadow-sm overflow-hidden relative dark:bg-secondary">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="absolute top-0 right-0 p-2 "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (product.id) {
                  wishlistMutation.mutate({ productId: product.id });
                }
              }}
            >
              {product &&
              product.productWishlist.length > 0 &&
              product.productWishlist[0].productId === product.id ? (
                <Heart fill="#e11d48" className="text-primary" />
              ) : (
                <Heart />
              )}
            </motion.div>
            <img
              className="object-cover"
              src={`${baseURL}/images/${product.primaryImage}`}
              alt={product.name}
            />
            <div className="flex flex-col gap-2 text-sm p-2">
              <div className="flex justify-between text-xs items-center font-bold text-muted-foreground">
                {lowLabel === highLabel ? (
                  <span>{sizes[0].label}</span>
                ) : (
                  <span>{`${lowLabel} - ${highLabel}`}</span>
                )}
              </div>
              <p className="font-bold text-sm md:text-base">{product.name}</p>
              <span>
                <p className="font-bold text-base md:text-xl">
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
