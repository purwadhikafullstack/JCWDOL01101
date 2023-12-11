import React from "react";
import { useSearchParams } from "react-router-dom";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const SizeFilterForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sizeParams = searchParams.get("size");
  return (
    <div className="flex flex-col  items-start gap-2">
      <span className="uppercase">Size</span>
      <div className="flex flex-wrap">
        {sizes.map((size) => (
          <div
            onClick={() => {
              setSearchParams((params) => {
                params.set("size", size);
                return params;
              });
            }}
            className={`${
              sizeParams === size && "border-primary"
            } border hover:border-primary/80 hover:bg-muted cursor-pointer  w-11 p-2 grid place-content-center`}
            key={size}
          >
            {size}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeFilterForm;
