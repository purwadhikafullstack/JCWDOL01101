import React from "react";

import { useProductsDashboard } from "@/hooks/useProduct";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function ProductPage() {
  const { data, isLoading } = useProductsDashboard();

  if (isLoading) return <p>Loading...</p>;
  return (
    data && (
      <div className="container mx-auto py10">
        <DataTable columns={columns} data={data} />
      </div>
    )
  );
}
