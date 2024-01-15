import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSize } from "@/hooks/useSize";
import { Button } from "@/components/ui/button";

const ProductSizeField = ({
  mutationStatus,
  edit = false,
}: {
  edit?: boolean;
  mutationStatus: boolean;
}) => {
  const form = useFormContext();
  const sizeValue: number[] = form.getValues("size");
  const [selectedSize, setSelectedSize] = useState<number[]>([]);
  const { data: sizes } = useSize();
  const sizeSet = new Set(selectedSize);

  useEffect(() => {
    if (edit && sizeValue.length > 0) {
      setSelectedSize(sizeValue);
    }
  }, [edit, sizeValue]);

  useEffect(() => {
    if (mutationStatus) {
      setSelectedSize([]);
    }
  }, [mutationStatus]);

  return (
    <FormField
      control={form.control}
      name="size"
      render={() => (
        <FormItem>
          <div className="w-ful grid grid-cols-3">
            <div>
              <FormLabel id="size" className="font-bold">
                Product Size
                <Badge
                  variant="secondary"
                  className="text-muted-foreground font-normal ml-2"
                >
                  Required
                </Badge>
              </FormLabel>
            </div>
            <div className="col-span-2">
              <FormControl>
                <div className="w-full flex gap-1 select-none">
                  {sizes && (
                    <>
                      {sizes.map((size) => {
                        const isSelected = sizeSet.has(size.id);
                        return (
                          <div
                            onClick={() => {
                              if (isSelected) {
                                sizeSet.delete(size.id);
                              } else {
                                sizeSet.add(size.id);
                              }
                              const filterValues = Array.from(sizeSet);
                              setSelectedSize(filterValues);
                              form.setValue("size", filterValues);
                            }}
                            key={size.id}
                            className={`${
                              isSelected && "border-primary shadow-sm"
                            } w-10 h-10 border text-sm bg-background hover:border-primary/60 cursor-pointer grid place-content-center`}
                          >
                            {size.label}
                          </div>
                        );
                      })}
                    </>
                  )}
                  {sizeSet.size > 0 && (
                    <Button
                      type="button"
                      onClick={() => setSelectedSize([])}
                      variant="ghost"
                      className="font-bold"
                    >
                      CLEAR
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default ProductSizeField;
