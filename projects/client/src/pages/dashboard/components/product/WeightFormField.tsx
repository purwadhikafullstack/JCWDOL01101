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

const WeightFormField = () => {
  const form = useFormContext();
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    form.setValue("weight", Number(numericValue));
    return numericValue;
  };
  return (
    <FormField
      control={form.control}
      name="weight"
      render={({ field }) => (
        <FormItem>
          <div className="w-ful grid grid-cols-3">
            <FormLabel id="weight" className="font-bold">
              Weight Product
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
                  <div className="border focus-within:ring-2 focus-within:ring-primary rounded-lg w-max flex items-center">
                    <input
                      {...field}
                      placeholder="Weight"
                      className="h-full py-2 outline-none pl-2 rounded-l-lg max-w-[150px]"
                      value={form.watch("weight") || ""}
                      onChange={(e) => {
                        const numericValue = formatNumber(e.target.value);
                        field.onChange(numericValue);
                      }}
                    />
                    <div className="w-full h-full bg-muted border-l py-3 px-2 rounded-r-lg text-xs font-bold text-muted-foreground">
                      grams
                    </div>
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

export default WeightFormField;
