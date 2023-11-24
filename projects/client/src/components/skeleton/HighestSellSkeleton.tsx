import React from "react";
import { Skeleton } from "../ui/skeleton";

const HighestSellSkeleton = () => {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-6 gap-4 w-full">
      <Skeleton className="w-full h-[350px] lg:h-[600px] col-span-4 lg:col-span-4 row-span-2" />
      <Skeleton className="w-full h-[100px] lg:h-full col-span-2 row-span-1" />
      <Skeleton className="w-full h-full col-span-2 row-span-1" />
    </div>
  );
};

export default HighestSellSkeleton;
