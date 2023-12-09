import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const NicknameFormField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-4 gap-2">
            <FormLabel className="font-semibold">
              NICKNAME<b className="text-primary">*</b>
            </FormLabel>
            <div className="col-span-3">
              <Input
                {...field}
                className="rounded-none"
                placeholder="please enter your nickname"
              />
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default NicknameFormField;
