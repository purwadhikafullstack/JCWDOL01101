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
  const { data: pd } = useProduct(slug || "");
  const { data: reviewData } = useReviewByProduct(pd?.product?.id);
  return (
    pd &&
    pd.product && (
      <div>
        <Breadcrumbs
          slug={pd.product.slug}
          categoryId={pd.product.categoryId}
          category={pd.product.productCategory}
          productName={pd.product.name}
        />
        <div className="w-full flex justify-between">
          <div className="flex-1 pt-2">
            <section className="max-w-[655px]">
              <ProductCarousel images={pd.product.productImage || []} />
              <section>
                {reviewData && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="leading-3 text-xl font-semibold mr-4">
                        REVIEW
                      </span>
                      <ReviewStar rating={reviewData.averageRating} />
                      <Link
                        to={`/product/${pd.product?.slug}/reviews`}
                        className="underline"
                      >
                        ({reviewData.totalReviews || 0})
                      </Link>
                    </div>
                    <Separator className="my-4" />
                    <OverallRating ratingCounts={reviewData.ratingCounts} />
                  </>
                )}
                <Link to={`/product/${pd.product.slug}/reviews/new`}>
                  <Button
                    variant="outline"
                    className="border-black uppercase mt-6 px-10 rounded-none"
                  >
                    Write Review
                  </Button>
                </Link>
                <Separator className="my-4" />
                <ReviewProduct productId={pd.product.id} />
                <Link to={`/product/${pd.product.slug}/reviews`}>
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
            <ProductDescription
              product={pd.product}
              totalStock={pd.totalStock}
              totalSold={pd.totalSold}
            />
          </div>
        </div>
        <div>
          <RecommendedProduct
            productId={pd.product.id}
            categoryId={pd.product.categoryId}
          />
        </div>
      </div>
    )
  );
};

export default ProductDetail;
