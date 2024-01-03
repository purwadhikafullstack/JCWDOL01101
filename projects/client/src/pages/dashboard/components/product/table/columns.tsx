import React from "react";
import { Product } from "@/hooks/useProduct";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <div className="flex items-center">
        <button
          className="border p-1 mr-2"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
        </button>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, getValue }) => <p>{getValue() as string}</p>,
  },
  {
    accessorKey: "size",
    header: "Availble Size",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row, getValue }) => (
      <p className="line-clamp-2">{getValue() as string}</p>
    ),
  },
];
