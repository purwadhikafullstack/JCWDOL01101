import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
const LIMIT = 200;

const AddressField = () => {
  const { t } = useTranslation();
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="address" className="font-bold">
            {t("checkoutPage.addressModal.add.address")}
          </FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2 w-full">
              <Textarea
                id="address"
                className="resize-none"
                {...field}
                value={field.value}
                onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  e.target.value = e.target.value.slice(0, LIMIT);
                }}
              />
              <span className="self-end text-xs text-muted-foreground">{`${
                form.getValues("address").length
              }/${LIMIT}`}</span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AddressField;
