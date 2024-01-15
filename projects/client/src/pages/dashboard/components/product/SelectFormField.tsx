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
import { useCategories } from "@/hooks/useCategory";
import { Link } from "react-router-dom";
import { Link1Icon } from "@radix-ui/react-icons";
import { ExternalLink, Link2, Link2Off } from "lucide-react";
const SelectFormField = () => {
  const form = useFormContext();
  const { data: categories } = useCategories();
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
              {categories && categories.length > 0 ? (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <div className="flex gap-2 ">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product Category" />
                      </SelectTrigger>
                      <Link
                        to="/dashboard/product/category"
                        className="flex gap-2 items-center text-primary text-sm w-10 p-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Link
                  to="/dashboard/product/category"
                  className="flex gap-2 items-center text-primary text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  please create a category first{" "}
                </Link>
              )}
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
