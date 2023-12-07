import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useOutsideClick from "@/hooks/useClickOutside";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const labels = ["Rumah", "Apartemen", "Kantor", "Kos"];
const LIMIT = 30;

const LabelField = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [label, setLabel] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);
  const form = useFormContext();

  useEffect(() => {
    if (!!label) {
      form.setValue("label", label);
    }
  }, [label]);

  useOutsideClick(ref, () => {
    setShow(false);
  });
  return (
    <FormField
      control={form.control}
      name="label"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold" htmlFor="label">
            {t("checkoutPage.addressModal.add.label")}
          </FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2 w-full">
              <Input
                id="label"
                {...field}
                value={field.value}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.slice(0, LIMIT);
                }}
                onClick={() => setShow(true)}
              />
              <span className="self-end text-xs text-muted-foreground">{`${
                form.getValues("label").length
              }/${LIMIT}`}</span>
              <div ref={ref}>
                {show && (
                  <div className="flex gap-2 items-center">
                    {labels.map((label) => (
                      <span
                        key={label}
                        onClick={() => setLabel(label)}
                        className="py-1 px-4 rounded-md border border-primary text-primary bg-background transition-all duration-200 hover:bg-primary/5 cursor-pointer"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LabelField;
