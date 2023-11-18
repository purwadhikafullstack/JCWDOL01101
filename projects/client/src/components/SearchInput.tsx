import React, { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

const SearchInput = () => {
  const [isClick, setIsClick] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsClick(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex-1 items-center relative flex-shrink-0 border rounded-full"
    >
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground peer-focus:text-primary" />
      <Input
        onClick={() => setIsClick(true)}
        className="w-full peer pl-10 rounded-full  bg-background"
        placeholder="Search Product"
      />
      <div
        className={`${
          isClick && "scale-y-100"
        } absolute z-50 scale-y-0 w-full  goup-hover:scale-y-100 origin-top left-1/2 -translate-x-1/2 translate-y-4 transition-all duration-200 bg-white shadow-md rounded-b-md p-2`}
      >
        <p className="text-center text-muted-foreground">no item found</p>
      </div>
    </div>
  );
};

export default SearchInput;
