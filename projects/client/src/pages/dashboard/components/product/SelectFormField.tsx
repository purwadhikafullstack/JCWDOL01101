import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
const categories = [
  {
    id: 1,
    category: "Men's Clothing",
  },
  {
    id: 2,
    category: "Women Appearell",
  },
  {
    id: 3,
    category: "Jacket",
  },
];
const SelectFormField = () => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <div className="w-ful grid grid-cols-3">
            <FormLabel id="categoryId" className="font-bold">
              Category
              <Badge
                variant="secondary"
                className="text-muted-foreground font-normal ml-2"
              >
                Required
              </Badge>
            </FormLabel>
            <div className="col-span-2">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(({ category, id }) => (
                    <SelectItem key={id} value={id.toString()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
