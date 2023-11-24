import React from "react";
import { Skeleton } from "../ui/skeleton";

const AddressModalSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="w-full h-[150px]" />
      <Skeleton className="w-full h-[150px]" />
    </div>
  );
};

export default AddressModalSkeleton;
