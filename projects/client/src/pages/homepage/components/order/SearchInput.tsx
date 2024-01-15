import React from 'react'
import {Input} from "@/components/ui/input"
import { Loader2, SearchIcon } from "lucide-react";
import { useSearchParams } from 'react-router-dom';

const SearchInput = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <div  className="relative border">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground peer-focus:text-primary" />
        <Input 
        value={searchParams.get("q") || ""}
        onChange={(e) => setSearchParams((params) => {
          params.set("q", e.target.value)
          return params;
        })}
        placeholder="Find your order here..."
        className="peer pl-10 rounded-none bg-background h-8 lg:h-9"/>
    </div>
  )
}

export default SearchInput