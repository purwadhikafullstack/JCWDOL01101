import React from "react";
import { Skeleton } from "../ui/skeleton";

const SelectCourierSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      <Skeleton className="w-[200px] h-8" />
      <Skeleton className="w-full h-10" />
    </div>
  );
};

export default SelectCourierSkeleton;
