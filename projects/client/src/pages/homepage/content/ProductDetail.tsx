import React, { useState } from "react";
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
import { useUser } from "@clerk/clerk-react";
import { useProductIsOrder } from "@/hooks/useOrder";
import PurchasedReviewModal from "../components/reviews/PurchasedReviewModal";
import { t } from "i18next";

const ProductDetail = () => {
  const { user } = useUser();
  const { slug } = useParams();
  const { data: pd } = useProduct(slug || "");
  const { data: userIsOrderProduct } = useProductIsOrder(
    user?.id,
    pd?.product.id
  );
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
        <div className="w-full flex flex-col lg:flex-row justify-between">
          <div className="flex-1 pt-2">
            <div className="lg:max-w-[655px]">
              <ProductCarousel images={pd.product.productImage || []} />
              <div className="lg:hidden">
                <ProductDescription
                  product={pd.product}
                  totalStock={pd.totalStock}
                  totalSold={pd.totalSold}
                />
              </div>
              {reviewData && (
                <>
                  <div className="flex items-center gap-2 mt-10 lg:mt-0">
                    <span className="leading-3 text-xl font-semibold mr-4">
                      {t("reviewsPage.review")}
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
              {userIsOrderProduct ? (
                <Link to={`/product/${pd.product.slug}/reviews/new`}>
                  <Button
                    variant="outline"
                    className="border-black uppercase mt-6 px-10 rounded-none"
                  >
                    {t("reviewsPage.form.writeReview")}
                  </Button>
                </Link>
              ) : (
                <PurchasedReviewModal />
              )}
              <Separator className="my-4" />
              <ReviewProduct slug={pd.product.slug} productId={pd.product.id} />
            </div>
          </div>
          <div className="w-full hidden md:block order-1 lg:order-2 lg:w-[522px] relative">
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
