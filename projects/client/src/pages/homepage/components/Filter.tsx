import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useSearchParams } from "react-router-dom";

const Filter = () => {
  const [_, setSearchParams] = useSearchParams({
    s: "all",
  });
  return (
    <>
      <Separator className="my-2" />
      <div className="flex gap-2 justify-between items-center">
        <h3 className="uppercase tracking-wide">Filter</h3>
        <Select
          onValueChange={(value) => {
            setSearchParams((params) => {
              params.set("f", value);
              return params;
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="featured" placeholder="Set a Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="lth">Lowest to Highest</SelectItem>
            <SelectItem value="htl">Highest to Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default Filter;
