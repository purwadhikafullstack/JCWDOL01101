import React from "react";
import { Skeleton } from "../ui/skeleton";

const NewestProductSekeleton = () => {
  return (
    <div className="grid grid-cols-6 gap-2 w-full">
      {Array(12)
        .fill(0)
        .map((v, i) => (
          <Skeleton key={i} className="w-full h-[318px]" />
        ))}
    </div>
  );
};

export default NewestProductSekeleton;
