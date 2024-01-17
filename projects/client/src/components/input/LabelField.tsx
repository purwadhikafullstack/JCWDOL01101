import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useOutsideClick from "@/hooks/useClickOutside";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const labels = ["Rumah", "Apartemen", "Kantor", "Kos"];
const LIMIT = 15;

const LabelField = () => {
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const ref = React.useRef<HTMLDivElement | null>(null);
  const form = useFormContext();

  React.useEffect(() => {
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
              <FormMessage />
              <span className="self-end text-xs text-muted-foreground">{`${
                form.getValues("label").length
              }/${LIMIT}`}</span>
              <div ref={ref}>
                {show && (
                  <div className="flex flex-wrap gap-2 items-center">
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
        </FormItem>
      )}
    />
  );
};

export default LabelField;
