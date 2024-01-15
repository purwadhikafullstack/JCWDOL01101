import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const MainCheckboxField = () => {
  const { t } = useTranslation();
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="isMain"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <span>{t("checkoutPage.addressModal.add.makeMain")}</span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MainCheckboxField;
