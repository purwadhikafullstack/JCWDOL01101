import { cn } from "@/lib/utils";
import React from "react";

type PropType = {
  selected: boolean;
  imgSrc: string;
  onClick: () => void;
  index: number;
};
const CarouselThumb = ({ imgSrc, selected, onClick, index }: PropType) => {
  return (
    <div className="flex gap-2 min-w-0 flex-shrink-0 flex-grow-0">
      <button
        className={cn(
          "w-[100px] bg-transparent touch-manipulation block cursor-pointer opacity-20 transition-opacity duration-200 rounded-lg",
          selected && "opacity-100  border-2 border-black dark:border-primary"
        )}
        onClick={onClick}
        type="button"
      >
        <img
          className="block object-cover w-full rounded-lg"
          src={imgSrc}
          alt={`Carousel Thumb ${index}`}
        />
      </button>
    </div>
  );
};

export default CarouselThumb;
