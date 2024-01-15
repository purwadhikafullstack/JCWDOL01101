import React from "react";
import { Button } from "@/components/ui/button";
import { formatToIDR } from "@/lib/utils";
import { useBoundStore } from "@/store/client/useStore";
import { t } from "i18next";
import { X } from "lucide-react";
import SelectBy from "./SelectBy";
import { useSearchParams } from "react-router-dom";

const ActiveFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterSize = useBoundStore((state) => state.size);
  const size = searchParams.get("size") || "";
  const pmin = searchParams.get("pmin") || "";
  const pmax = searchParams.get("pmax") || "";
  const setFilterSize = useBoundStore((state) => state.setSize);
  return (
    <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-2 md:gap-8 w-full product_filter">
      <div className="flex items-start flex-wrap w-full">
        <div className="flex items-center gap-2 flex-wrap w-full">
          {size && (
            <div className="gap-2 p-2 flex items-center flex-wrap pr-1">
              {filterSize.map(
                (s) =>
                  s.id > 0 && (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 border p-2 rounded-lg"
                    >
                      <span className="mr-1">{s.label}</span>
                      <X
                        className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          const removeCurrentSize = size
                            .split(",")
                            .filter((ss) => +ss !== s.id);
                          setSearchParams({
                            size:
                              removeCurrentSize.length > 1
                                ? removeCurrentSize.join(",")
                                : "",
                          });
                          setFilterSize(
                            filterSize.filter((fs) => fs.id !== s.id)
                          );
                        }}
                      />
                    </div>
                  )
              )}
            </div>
          )}
          {(pmax || pmin) && (
            <div className="border p-2 flex items-center pr-1 text-sm rounded-lg">
              {pmax && pmin
                ? `${formatToIDR(pmin)} - ${formatToIDR(pmax)}`
                : pmax
                ? formatToIDR(pmax)
                : pmin
                ? formatToIDR(pmin)
                : ""}
              <X
                className="cursor-pointer w-4 h-4 ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  if (pmin) {
                    setSearchParams((params) => {
                      params.delete("pmin");
                      return params;
                    });
                  }
                  if (pmax) {
                    setSearchParams((params) => {
                      params.delete("pmax");
                      return params;
                    });
                  }
                }}
              />
            </div>
          )}

          {(size || pmax || pmin) && (
            <Button
              size="sm"
              className="h-10"
              variant="ghost"
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("size");
                  params.delete("pmin");
                  params.delete("pmax");
                  return params;
                });
              }}
            >
              CLEAR ALL
            </Button>
          )}
        </div>
      </div>
      <SelectBy />
    </div>
  );
};

export default ActiveFilter;
