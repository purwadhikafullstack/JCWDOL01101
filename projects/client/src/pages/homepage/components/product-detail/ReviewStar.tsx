import React from "react";
import { Scale, Star } from "lucide-react";
import { motion } from "framer-motion";

type ReviewStarProps = {
  rating: number;
};

const ReviewStar = ({ rating }: ReviewStarProps) => {
  const fillColor = "#ebbe00";
  const emptyColor = "#dadada";

  const starts = Array.from({ length: 5 }, (_, index) => {
    const fill = index < rating ? fillColor : emptyColor;
    return fill === fillColor ? (
      <motion.div
        transition={{
          type: "spring",
          ease: "anticipate",
          duration: 0.2,
        }}
        whileTap={{ scale: 1.3 }}
        whileHover={{
          rotate: [-10, 10],
          scale: 0.9,
        }}
        initial={{
          scale: 1,
          rotate: 0,
        }}
      >
        <Star
          fill={fill}
          className="text-transparent w-6 h-6 transition-colors duration-100"
        />
      </motion.div>
    ) : (
      <Star key={index} fill={fill} className="text-transparent w-5 h-5" />
    );
  });

  return <div className="flex items-center">{starts}</div>;
};

export default ReviewStar;
