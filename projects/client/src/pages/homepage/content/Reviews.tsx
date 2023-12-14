import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/product-detail/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { Review, ReviewByProduct, useReviewsInfinite } from "@/hooks/useReview";
import ReviewStar from "../components/product-detail/ReviewStar";
import { Separator } from "@/components/ui/separator";
import ReviewComponent from "../components/reviews/Review";
import { Button } from "@/components/ui/button";
import OverallRating from "../components/product-detail/OverallRating";
import { ArrowUp } from "lucide-react";
import ReviewSkeleton from "@/components/skeleton/ReviewSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/clerk-react";
import { useProductIsOrder } from "@/hooks/useOrder";
import PurchasedReviewModal from "../components/reviews/PurchasedReviewModal";
import { useTranslation } from "react-i18next";

const Reviews = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { slug } = useParams();
  const { data: pd, isLoading: productLoading } = useProduct(slug || "");
  const { data: userIsOrderProduct } = useProductIsOrder(
    user?.id,
    pd?.product.id
  );

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useReviewsInfinite({ productId: pd?.product?.id, limit: 5 });
  const reviewData: ReviewByProduct = isSuccess && data.pages[0];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      {productLoading ? (
        <Skeleton className="rounded-none w-[35%] h-6 mb-4" />
      ) : (
        <>
          {pd && pd.product && slug && (
            <Breadcrumbs
              productName={pd.product.name}
              categoryId={pd.product.categoryId}
              category={pd.product.productCategory}
              slug={slug}
            />
          )}
        </>
      )}

      <Link to={`/product/${slug}`} className="underline uppercase">
        {t("reviewsPage.backToProduct")}
      </Link>
      {productLoading ? (
        <Skeleton className="h-8 w-[40%] my-2" />
      ) : (
        <h1 className="text-2xl font-bold my-2">{pd?.product?.name}</h1>
      )}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <b className="uppercase font-bold text-3xl">
              {t("reviewsPage.review")}
            </b>
            {isLoading ? (
              <Skeleton className="rounded-none w-[150px] h-5" />
            ) : (
              <>
                {reviewData && (
                  <span className="flex items-center gap-2">
                    <ReviewStar rating={reviewData.averageRating} />
                    <p className="text-sm">({reviewData.totalReviews})</p>
                  </span>
                )}
              </>
            )}
          </div>
          <Separator className="my-4" />
          {isLoading ? (
            <Skeleton className="rounded-none w-[100px] h-6" />
          ) : (
            <span className="font-bold">
              {reviewData?.totalReviews || 0} {t("reviewsPage.review")}
            </span>
          )}
          <Separator className="my-4" />
          <div className="flex flex-col justify-center">
            {isLoading ? (
              <ReviewSkeleton />
            ) : (
              <>
                {data &&
                  data.pages.map((page) => {
                    return page.reviews.map((review: Review) => (
                      <ReviewComponent key={review.id} review={review} />
                    ));
                  })}
                {hasNextPage && (
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    variant="outline"
                    className="border-black rounded-none w-max mx-auto md:px-20"
                  >
                    {isFetchingNextPage
                      ? t("reviewsPage.load.loading")
                      : hasNextPage
                      ? t("reviewsPage.load.hasNextPage")
                      : ""}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-[350px] relative">
          <div className="sticky top-[100px]">
            <div className="border p-4 space-y-3">
              <h3 className="uppercase font-bold text-2xl">
                {t("reviewsPage.reviewSummary")}
              </h3>
              {isLoading ? (
                <div>
                  <Skeleton className="w-[100px] h-5 mb-4  rounded-none" />
                  <div className="space-y-2">
                    <Skeleton className="w-[150px] h-5 rounded-none" />
                    <Skeleton className="w-[150px] h-5 rounded-none" />
                    <Skeleton className="w-[150px] h-5 rounded-none" />
                    <Skeleton className="w-[150px] h-5 rounded-none" />
                    <Skeleton className="w-[150px] h-5 rounded-none" />
                  </div>
                </div>
              ) : (
                <>
                  {reviewData && (
                    <OverallRating ratingCounts={reviewData.ratingCounts} />
                  )}
                </>
              )}
              {userIsOrderProduct ? (
                <Link to={`/product/${pd?.product?.slug}/reviews/new`}>
                  <Button
                    variant="outline"
                    className="border-black uppercase mt-6 w-full rounded-none"
                  >
                    {t("reviewsPage.allowReview.btn")}
                  </Button>
                </Link>
              ) : (
                <PurchasedReviewModal />
              )}
            </div>
          </div>
        </div>
      </div>

      {isVisible && (
        <Button
          onClick={scrollToTop}
          variant="outline"
          className="border-black uppercase mt-6 w-max rounded-none"
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          {t("reviewsPage.backToTop")}
        </Button>
      )}
    </div>
  );
};

export default Reviews;
