import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useSearchParams } from "react-router-dom";

const TablePagination = ({
  dataLength,
  currentPage,
  totalPages,
}: {
  dataLength: number;
  currentPage: number;
  totalPages: number;
}) => {
  const [_, setSearchParams] = useSearchParams();
  return (
    <div className="flex gap-2 items-center">
      <p className="text-sm">
        Page {currentPage} of {totalPages || 0}
      </p>
      <Button
        disabled={currentPage <= 1}
        onClick={() => {
          setSearchParams((params) => {
            if (currentPage > 1) {
              params.set("page", (currentPage - 1).toString());
            }
            return params;
          });
        }}
        variant="outline"
      >
        <ChevronLeft />
      </Button>
      <Button
        disabled={!(currentPage < totalPages) || false}
        onClick={() => {
          setSearchParams((params) => {
            params.set("page", (currentPage + 1).toString());
            return params;
          });
        }}
        variant="outline"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default TablePagination;
