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
import { useTranslation } from "react-i18next";

const CommentFormField = () => {
  const { t } = useTranslation();
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="comment"
      render={({ field }) => (
        <FormItem>
          <div className="grid lg:grid-cols-4 gap-2">
            <FormLabel className="font-semibold">
              {t("reviewsPage.form.comment")}
              <b className="text-primary">*</b>
            </FormLabel>
            <div className="col-span-3">
              <Textarea {...field} />
              <FormDescription>
                {t("reviewsPage.form.commentDesc")}
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
