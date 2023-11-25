import React from "react";
import { Skeleton } from "../ui/skeleton";

const CartSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-2 items-center">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="flex-1 h-full" />
      </div>
      <div className="w-full flex gap-2 items-center">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="flex-1 h-full" />
      </div>
      <div className="w-full flex gap-2 items-center">
        <Skeleton className="w-10 h-10" />
        <Skeleton className="flex-1 h-full" />
      </div>
    </div>
  );
};

export default CartSkeleton;
