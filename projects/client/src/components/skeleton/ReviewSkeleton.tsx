import React from "react";
import { Skeleton } from "../ui/skeleton";

const ReviewSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="w-[120px] h-4 rounded-none" />
            <Skeleton className="w-[120px] h-4 rounded-none" />
          </div>
          <Skeleton className="w-[200px] h-4 rounded-none" />
          <Skeleton className="w-[250px] h-4 rounded-none" />
          <Skeleton className="w-full h-[100px] rounded-none" />
        </div>
      ))}
    </div>
  );
};

export default ReviewSkeleton;
