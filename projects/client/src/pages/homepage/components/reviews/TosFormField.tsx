import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

const TosFormField = () => {
  const { t } = useTranslation();
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="tos"
      render={({ field }) => (
        <FormItem>
          <FormMessage />
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              id="tos"
            />
            <FormLabel htmlFor="tos" className="font-semibold">
              {t("reviewsPage.form.note.tos")}
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export default TosFormField;
