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

const PhoneField = () => {
  const form = useFormContext();
  const formatPhoneNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    form.setValue("phone", numericValue);
    return numericValue;
  };
  return (
    <FormField
      control={form.control}
      name="formatPhone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={form.watch("formatPhone") || ""}
              onChange={(e) => {
                const formattedPhoneNumber = formatPhoneNumber(e.target.value);
                field.onChange(formattedPhoneNumber);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneField;
