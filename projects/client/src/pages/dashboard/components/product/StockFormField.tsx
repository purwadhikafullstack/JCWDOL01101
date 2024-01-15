import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

const StockFormField = () => {
  const form = useFormContext();
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    form.setValue("stock", Number(numericValue));
    return numericValue;
  };
  return (
    <FormField
      control={form.control}
      name="stock"
      render={({ field }) => (
        <FormItem>
          <div className="w-ful grid grid-cols-3">
            <FormLabel id="stock" className="font-bold">
              Stock
              <Badge
                variant="secondary"
                className="text-muted-foreground font-normal ml-2"
              >
                Required
              </Badge>
            </FormLabel>
            <div className="col-span-2">
              <FormControl>
                <div className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    placeholder="Enter Stock"
                    value={form.watch("stock") || ""}
                    onChange={(e) => {
                      const numericValue = formatNumber(e.target.value);
                      field.onChange(numericValue);
                    }}
                  />
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

export default StockFormField;
