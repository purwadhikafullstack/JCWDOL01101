import React from "react";
import { useReviewByProduct } from "@/hooks/useReview";
import Review from "./Review";

type ReviewProductProps = {
  productId: number;
};

const ReviewProduct = ({ productId }: ReviewProductProps) => {
  const { data } = useReviewByProduct(productId);
  return (
    <div>
      {data &&
        data.reviews.map((review) => (
          <Review review={review} key={review.id} />
        ))}
    </div>
  );
};

export default ReviewProduct;
