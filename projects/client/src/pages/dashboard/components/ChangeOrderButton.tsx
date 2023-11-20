import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React from "react";
import { useSearchParams } from "react-router-dom";

const ChangeOrderButton = ({
  paramKey,
  name,
}: {
  paramKey: string;
  name: string;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get(paramKey);
  return (
    <Button
      onClick={() => {
        setSearchParams((params) => {
          const currentOrder = searchParams.get("order");
          const newOrder = currentOrder !== "ASC" ? "ASC" : "DESC";
          params.set("filter", paramKey);
          params.set("order", newOrder);
          return params;
        });
      }}
      variant="ghost"
    >
      {name}
      {param ? (
        param === "ASC" ? (
          <ArrowUp className="w-4 h-4 ml-2" />
        ) : (
          <ArrowDown className="w-4 h-4 ml-2" />
        )
      ) : (
        <ArrowUpDown className="w-4 h-4 ml-2" />
      )}
    </Button>
  );
};

export default ChangeOrderButton;
