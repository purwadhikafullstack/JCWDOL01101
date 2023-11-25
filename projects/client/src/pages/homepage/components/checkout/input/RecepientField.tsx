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

const RecepientField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="recepient"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Recepeint's name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecepientField;
