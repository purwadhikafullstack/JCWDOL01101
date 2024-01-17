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
import { useTranslation } from "react-i18next";
const LIMIT = 50;

const RecepientField = () => {
  const { t } = useTranslation();
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="recepient"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold" htmlFor="recepient">
            {t("checkoutPage.addressModal.add.recepient")}
          </FormLabel>
          <FormControl>
            <div className="w-full flex flex-col gap-2">
              <Input
                id="recepient"
                {...field}
                value={field.value}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.slice(0, LIMIT);
                }}
              />
              <FormMessage />
              <span className="self-end text-xs text-muted-foreground">{`${
                form.getValues("recepient").length
              }/${LIMIT}`}</span>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default RecepientField;
