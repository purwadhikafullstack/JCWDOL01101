import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatToIDR } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

const PriceFormField = () => {
  const form = useFormContext();
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(Number(numericValue))
      .replace(/Rp\s?/g, "");
    form.setValue("formattedPrice", formattedValue);
    form.setValue("price", Number(numericValue));
    return formattedValue;
  };
  return (
    <FormField
      control={form.control}
      name="formattedPrice"
      render={({ field }) => (
        <FormItem>
          <div className="w-ful grid grid-cols-3">
            <FormLabel id="price" className="font-bold">
              Price
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
                  <div className="border w-full focus-within:ring-2 focus-within:ring-primary rounded-lg flex items-center">
                    <div className="w-max h-full bg-muted border-r py-2 px-4 rounded-l-lg font-bold text-muted-foreground text-sm">
                      Rp
                    </div>
                    <input
                      {...field}
                      placeholder="Enter Price"
                      className="w-full outline-none py-1 pl-2 rounded-r-lg"
                      value={form.watch("formattedPrice") || ""}
                      onChange={(e) => {
                        const formattedValue = formatNumber(e.target.value);
                        field.onChange(formattedValue);
                      }}
                    />
                  </div>
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

export default PriceFormField;
