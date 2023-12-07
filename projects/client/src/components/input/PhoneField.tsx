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
const LIMIT = 15;

const PhoneField = () => {
  const { t } = useTranslation();
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
          <FormLabel className="font-bold" htmlFor="phone">
            {t("checkoutPage.addressModal.add.recepient")}
          </FormLabel>
          <FormControl>
            <div className="w-full flex flex-col gap-2">
              <Input
                id="phone"
                {...field}
                value={form.watch("formatPhone") || ""}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.slice(0, LIMIT);
                }}
                onChange={(e) => {
                  const formattedPhoneNumber = formatPhoneNumber(
                    e.target.value
                  );
                  field.onChange(formattedPhoneNumber);
                }}
              />
              <span className="self-end text-xs text-muted-foreground">{`${
                form.getValues("phone").length
              }/${LIMIT}`}</span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneField;
