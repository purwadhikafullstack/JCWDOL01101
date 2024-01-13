import React, { useEffect, useRef, useState } from "react";
import { Loader2, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useDebounce } from "use-debounce";
import { useSearchProducts } from "@/hooks/useProduct";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  expandSearch: boolean;
  setExpandSearch: (e: boolean) => void;
};
const SearchInput = ({ expandSearch, setExpandSearch }: SearchInputProps) => {
  const { t } = useTranslation();
  const [isClick, setIsClick] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch] = useDebounce(searchTerm.trim(), 300);
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useSearchProducts(debounceSearch);

  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsClick(false);
      setExpandSearch(false);
      queryClient.removeQueries({
        queryKey: ["search/products", searchTerm],
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
        setIsClick(true);
        setExpandSearch(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex-1 items-center relative flex-shrink-0 border rounded-lg"
    >
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground peer-focus:text-primary" />
      <Input
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={() => {
          setIsClick(true);
          setExpandSearch(true);
        }}
        className={cn(
          "peer pl-10  bg-background h-8 lg:h-9 rounded-lg",
          expandSearch && "w-full"
        )}
        placeholder={t("navbar.searchPlaceholder")}
      />
      <div
        className={cn(
          "absolute overflow-y-auto max-h-[200px] z-50 scale-y-0 w-full  goup-hover:scale-y-100 origin-top left-1/2 -translate-x-1/2 translate-y-2 lg:translate-y-4 transition-all duration-100  bg-background rounded-b-lg shadow-md p-2",
          searchTerm.trim().length > 0 && isClick && "scale-y-100"
        )}
      >
        {isLoading ? (
          <Loader2 className="animate-spin w-5 h-5 mx-auto text-muted-foreground" />
        ) : (
          <div>
            {products && products.length > 0 ? (
              <>
                {products.map((product) => (
                  <Link
                    onClick={() => {
                      setIsClick(false);
                      setSearchTerm(" ");
                      queryClient.removeQueries({
                        queryKey: ["search/products", searchTerm],
                      });
                    }}
                    to={`/product/${product.slug}`}
                    key={product.id}
                    className="flex items-center gap-2 w-full p-2 hover:bg-muted cursor-pointer rounded-md"
                  >
                    <SearchIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    <p key={product.id}>{product.name}</p>
                  </Link>
                ))}
              </>
            ) : (
              <p className="text-muted-foreground text-center">
                no products found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
