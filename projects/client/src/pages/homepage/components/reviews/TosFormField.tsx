import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const TosFormField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="tos"
      render={({ field }) => (
        <FormItem>
          <FormMessage />
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              id="tos"
              className="rounded-none"
            />
            <FormLabel htmlFor="tos" className="font-semibold">
              I agree to the TOKEN TERMS OF USE
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export default TosFormField;
