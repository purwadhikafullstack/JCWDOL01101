import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  totalPages: number;
};
const OrderPagination = ({ totalPages }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  return (
    <div className="flex items-center gap-4">
      <Button
        disabled={currentPage <= 1}
        onClick={() => {
          if (currentPage > 1) {
            setSearchParams((params) => {
              params.set("page", String(currentPage - 1));
              return params;
            });
          }
        }}
        variant="outline"
      >
        <ChevronLeft />
      </Button>
      <div>{currentPage}</div>
      <Button
        disabled={currentPage >= totalPages}
        onClick={() => {
          if (currentPage < totalPages) {
            setSearchParams((params) => {
              params.set("page", String(currentPage + 1));
              return params;
            });
          }
        }}
        variant="outline"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default OrderPagination;
