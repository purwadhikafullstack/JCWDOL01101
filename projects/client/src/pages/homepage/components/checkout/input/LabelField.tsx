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

const labels = ["Rumah", "Apartemen", "Kantor", "Kos"];

const LabelField = () => {
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
          <FormLabel>Label Address</FormLabel>
          <FormControl>
            <div ref={ref}>
              <Input {...field} onClick={() => setShow(true)} />

              {show && (
                <div className="flex gap-2 items-center mt-8">
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LabelField;
