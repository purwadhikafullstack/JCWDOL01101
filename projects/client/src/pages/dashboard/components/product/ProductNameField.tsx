import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
  description: string;
  maxLength?: number;
  isAlreadySold?: boolean | undefined;
}

const ProductNameField = ({
  name,
  label,
  description,
  maxLength = 70,
  isAlreadySold,
}: Props) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={isAlreadySold}
      render={({ field }) => (
        <FormItem>
          <div className="w-ful grid grid-cols-3">
            <div>
              <FormLabel id={name} className="font-bold">
                {label}
                <Badge
                  variant="secondary"
                  className="text-muted-foreground font-normal ml-2"
                >
                  Required
                </Badge>
              </FormLabel>
              <p className="text-xs mt-2 text-muted-foreground max-w-[200px] ">
                Name <b>cannot be changed</b> after the product is sold.
              </p>
            </div>
            <div className="col-span-2">
              <FormControl>
                <div className="w-full flex flex-col gap-2">
                  <Input
                    id={name}
                    {...field}
                    value={field.value}
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.target.value = e.target.value.slice(0, maxLength);
                    }}
                  />
                  {
                    !isAlreadySold && (
                      <span className="self-end text-xs text-muted-foreground">{`${form.getValues("name").length
                        }/${maxLength}`}</span>

                    )
                  }
                </div>
              </FormControl>
              <FormDescription>{description}</FormDescription>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default ProductNameField;
