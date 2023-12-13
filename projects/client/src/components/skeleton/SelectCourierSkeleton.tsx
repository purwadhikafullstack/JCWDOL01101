import React from "react";
import { Skeleton } from "../ui/skeleton";

const SelectCourierSkeleton = () => {
  return (
    <div>
      <div className="w-full grid grid-cols-2 gap-4 mt-2">
        <Skeleton className="h-6 mb-2" />
      </div>
      <Skeleton className="h-12" />
      <div className="w-full grid grid-cols-2 gap-4 mt-2">
        <Skeleton className="h-10" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-10" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
        </div>
      </div>
    </div>
  );
};

export default SelectCourierSkeleton;
