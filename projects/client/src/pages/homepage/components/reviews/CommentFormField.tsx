import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const CommentFormField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="comment"
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-4 gap-2">
            <FormLabel className="font-semibold">
              COMMENT<b className="text-primary">*</b>
            </FormLabel>
            <div className="col-span-3">
              <Textarea {...field} className="rounded-none" />
              <FormDescription>
                You must write a minimum of 50 characters in this column.
              </FormDescription>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default CommentFormField;
