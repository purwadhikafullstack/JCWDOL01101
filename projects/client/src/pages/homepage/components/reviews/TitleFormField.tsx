import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const TitleFormField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-4 gap-2">
            <FormLabel className="font-semibold">
              TITLE<b className="text-primary">*</b>
            </FormLabel>
            <div className="col-span-3">
              <Input
                {...field}
                className="rounded-none"
                placeholder="summarize your review"
              />
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default TitleFormField;
