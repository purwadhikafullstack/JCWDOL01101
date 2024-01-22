import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useFormContext } from "react-hook-form";

const ProductFormTextarea = ({ maxLength = 2000 }: { maxLength?: number }) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <div className="w-ful grid grid-cols-3">
            <FormLabel id="description" className="font-bold">
              Product Description
            </FormLabel>
            <div className="col-span-2">
              <FormControl>
                <div className="w-full flex flex-col gap-1">
                  <Textarea
                    {...field}
                    value={field.value}
                    onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      e.target.value = e.target.value.slice(0, maxLength);
                    }}
                  />
                  <FormDescription>
                    Write your product description min. 80 characters so that
                    buyers can easily understand.
                  </FormDescription>

                  <span className="self-end text-xs text-muted-foreground">{`${form.getValues("description").length
                    }/${maxLength}`}</span>
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

export default ProductFormTextarea;
