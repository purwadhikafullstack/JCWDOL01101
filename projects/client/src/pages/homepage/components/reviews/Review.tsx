import { Review as ReviewType } from "@/hooks/useReview";
import { format } from "date-fns";
import React from "react";
import ReviewStar from "../product-detail/ReviewStar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const Review = ({ review }: { review: ReviewType }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-bold uppercase">{review.nickname}</span>
        <p className="text-muted-foreground text-sm">
          {format(new Date(review.createdAt), "P")}
        </p>
      </div>
      <div className="my-2">
        <ReviewStar rating={review.rating} />
      </div>
      <h3 className="text-xl font-bold">{review.title}</h3>
      <p
        className={cn(
          review.comment.split(" ")[0].length > 100 &&
            "overflow-hidden text-ellipsis whitespace-nowrap w-[350px]"
        )}
      >
        {review.comment}
      </p>
      <Separator className="my-3" />
    </>
  );
};

export default Review;
