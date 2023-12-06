import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const ProductSizeField = ({
  mutationStatus,
  edit = false,
}: {
  edit?: boolean;
  mutationStatus: boolean;
}) => {
  const form = useFormContext();
  const sizeValue: string = form.getValues("size");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (edit && sizeValue) {
      setSelectedSize(sizeValue);
    }
  }, [edit, sizeValue]);

  useEffect(() => {
    if (selectedSize) {
      form.setValue("size", selectedSize);
    }
  }, [selectedSize]);

  useEffect(() => {
    if (mutationStatus) {
      setSelectedSize("");
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
                  {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((size) => (
                    <div
                      onClick={() => setSelectedSize(size)}
                      key={size}
                      className={`${
                        selectedSize === size && "border-primary shadow-sm"
                      } w-10 h-10 border text-sm hover:border-primary/60 cursor-pointer grid place-content-center`}
                    >
                      {size}
                    </div>
                  ))}
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
