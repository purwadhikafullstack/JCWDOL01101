import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useFormContext } from "react-hook-form";

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
const ProductSelectFormField = () => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product Category</FormLabel>
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
        </FormItem>
      )}
    />
  );
};

export default ProductSelectFormField;
