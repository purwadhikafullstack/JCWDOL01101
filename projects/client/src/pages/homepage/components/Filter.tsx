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
    <div className="flex flex-col">
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
            <SelectItem value="hs">Highest Sell</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* TODO: refactor filter */}
      <div className="flex gap-2 items-center justify-between py-2">
        <p>Arrival</p>
        <Select
          onValueChange={(value) => {
            setSearchParams((params) => {
              params.set("arrival", value);
              return params;
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="featured" placeholder="Set a Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">Newest</SelectItem>
            <SelectItem value="old">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 items-center justify-between py-2">
        <p>Availablity</p>
        <Select
          onValueChange={(value) => {
            setSearchParams((params) => {
              params.set("arrival", value);
              return params;
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="featured" placeholder="Set a Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cheap">In Stock</SelectItem>
            <SelectItem value="expensive">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filter;
