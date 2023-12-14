import React from "react";
import { useReviewByProduct } from "@/hooks/useReview";
import Review from "./Review";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ReviewProductProps = {
  slug: string;
  productId: number;
};

const ReviewProduct = ({ slug, productId }: ReviewProductProps) => {
  const { t } = useTranslation();
  const { data } = useReviewByProduct(productId);
  return (
    <div>
      {data &&
        data.reviews.map((review) => (
          <Review review={review} key={review.id} />
        ))}

      {data && data.reviews.length > 0 && (
        <Link to={`/product/${slug}/reviews`}>
          <Button
            variant="outline"
            className="border-black uppercase mt-6 px-10 rounded-none"
          >
            {t("productDetailPage.misc.sub")}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ReviewProduct;
