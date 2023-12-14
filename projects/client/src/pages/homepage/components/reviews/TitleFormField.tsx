import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

const TitleFormField = () => {
  const { t } = useTranslation();
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <div className="grid lg:grid-cols-4 gap-2">
            <FormLabel className="font-semibold">
              {t("reviewsPage.form.title")}
              <b className="text-primary">*</b>
            </FormLabel>
            <div className="col-span-3">
              <Input
                {...field}
                className="rounded-none"
                placeholder={t("reviewsPage.form.titlePlaceholder")}
              />
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default TitleFormField;
