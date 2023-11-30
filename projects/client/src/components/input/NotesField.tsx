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
const LIMIT = 45;

const NotesField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="notes">Notes for courier (optional)</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2 w-full">
              <Input
                id="notes"
                {...field}
                value={field.value}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.slice(0, LIMIT);
                }}
              />
              <FormDescription>
                House colors, standards, special messages, etc.
              </FormDescription>
              <span className="self-end text-xs text-muted-foreground">{`${
                form.getValues("notes").length
              }/${LIMIT}`}</span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesField;
