import React from "react"
import { Skeleton } from "../ui/skeleton"

const TablePageSkeleton = () => {
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-4 justify-between py-4">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-20" />
      </div>
      <Skeleton className="h-10" />
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
    </div>
  )
}

export default TablePageSkeleton
