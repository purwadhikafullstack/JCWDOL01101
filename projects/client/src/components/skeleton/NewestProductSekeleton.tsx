import React from "react";
import { Skeleton } from "../ui/skeleton";

const NewestProductSekeleton = ({ product }: { product: number }) => {
  return Array(product)
    .fill(0)
    .map((v, i) => <Skeleton key={i} className="w-full h-[280px]" />);
};

export default NewestProductSekeleton;
