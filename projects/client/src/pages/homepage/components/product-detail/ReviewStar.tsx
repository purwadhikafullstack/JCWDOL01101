import React from "react";
import { Star } from "lucide-react";

type ReviewStarProps = {
  rating: number;
};

const ReviewStar = ({ rating }: ReviewStarProps) => {
  const fillColor = "#ebbe00";
  const emptyColor = "#dadada";

  const starts = Array.from({ length: 5 }, (_, index) => {
    const fill = index < rating ? fillColor : emptyColor;
    return <Star fill={fill} className="text-transparent" />;
  });

  return <div className="flex items-center">{starts}</div>;
};

export default ReviewStar;
