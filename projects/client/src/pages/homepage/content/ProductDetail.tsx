import React from "react";
import ProductCarousel from "../components/ProductCarousel";
import ReviewStar from "../components/product-detail/ReviewStar";
import ProductDescription from "../components/product-detail/ProductDescription";
import Breadcrumbs from "../components/product-detail/Breadcrumbs";
import RecommendedProduct from "../components/product-detail/RecommendedProduct";
import { useProduct } from "@/hooks/useProduct";
import { Link, useParams } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import OverallRating from "../components/product-detail/OverallRating";
import { Button } from "@/components/ui/button";
import ReviewProduct from "../components/reviews/ReviewProduct";
import { useReviewByProduct } from "@/hooks/useReview";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product } = useProduct(slug || "");
  const { data: reviewData } = useReviewByProduct(product?.id);
  return (
    <div>
      {product && (
        <Breadcrumbs
          slug={product.slug}
          categoryId={product.categoryId}
          category={product.productCategory}
          productName={product.name}
        />
      )}
      <div className="w-full flex justify-between">
        <div className="flex-1 pt-2">
          <section className="max-w-[655px]">
            <ProductCarousel images={product?.productImage || []} />
            <section>
              {reviewData && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="leading-3 text-xl font-semibold mr-4">
                      REVIEW
                    </span>
                    <ReviewStar rating={reviewData.averageRating} />
                    <Link
                      to={`/product/${product?.slug}/reviews`}
                      className="underline"
                    >
                      ({reviewData.totalReviews || 0})
                    </Link>
                  </div>
                  <Separator className="my-4" />
                  <OverallRating ratingCounts={reviewData.ratingCounts} />
                </>
              )}
              <Link to={`/product/${product?.slug}/reviews/new`}>
                <Button
                  variant="outline"
                  className="border-black uppercase mt-6 px-10 rounded-none"
                >
                  Write Review
                </Button>
              </Link>
              <Separator className="my-4" />
              {product && <ReviewProduct productId={product.id} />}
              <Link to={`/product/${product?.slug}/reviews`}>
                <Button
                  variant="outline"
                  className="border-black uppercase mt-6 px-10 rounded-none"
                >
                  See More
                </Button>
              </Link>
            </section>
          </section>
        </div>
        <div className="w-[522px] relative">
          {product && <ProductDescription product={product} />}
        </div>
      </div>
      <div>
        {product && (
          <RecommendedProduct
            productId={product.id}
            categoryId={product.categoryId}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
