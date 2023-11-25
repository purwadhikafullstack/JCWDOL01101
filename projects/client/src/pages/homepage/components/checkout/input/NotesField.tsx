import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

const NotesField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes for courier (optional)</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>
            House colors, standards, special messages, etc.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesField;
