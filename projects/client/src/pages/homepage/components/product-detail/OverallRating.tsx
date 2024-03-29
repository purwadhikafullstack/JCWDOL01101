import React from "react";
import ReviewStar from "./ReviewStar";
import { RatingCount } from "@/hooks/useReview";
import { useTranslation } from "react-i18next";

type OverallRatingProps = {
  ratingCounts: RatingCount[];
};

const OverallRating = ({ ratingCounts }: OverallRatingProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="uppercase font-bold mb-4">{t("reviewsPage.rating")}</h3>
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, index) => {
          const ratingValue = 5 - index;
          const ratingCountObj = ratingCounts.find(
            ({ rating }) => rating === ratingValue
          );
          const count = ratingCountObj ? ratingCountObj.count : 0;
          return (
            <div key={index} className="flex gap-2 items-center">
              <ReviewStar rating={ratingValue} />{" "}
              <p className="text-sm">({count})</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverallRating;
