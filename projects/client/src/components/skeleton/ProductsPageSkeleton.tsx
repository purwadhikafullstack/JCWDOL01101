import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductsPageSkeleton = () => {
  return (
    <div className="space-y-2 mt-20">
      <Skeleton className="h-10" />
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
    </div>
  );
};

export default ProductsPageSkeleton;
