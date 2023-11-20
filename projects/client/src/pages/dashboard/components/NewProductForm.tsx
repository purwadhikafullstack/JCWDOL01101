import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useProductMutation } from "@/hooks/useProductMutation";
import { formatToIDR } from "@/lib/utils";
import ImageUpload from "./ImageUpload";
import ProductFormField from "./ProductFormField";
import ProductSelectFormField from "./ProductSelectFormField";
import { useToast } from "@/components/ui/use-toast";

export const productSchema = z.object({
  name: z.string().min(2, "Product name is empty"),
  categoryId: z.string().min(1, "Category is empty"),
  formattedPrice: z.string().min(1, "Price is empty"),
  price: z.coerce.number().min(1),
  stock: z.coerce.number().min(1, "Stock is empty"),
  weight: z.coerce.number().min(1, "Weight is empty"),
  description: z.string().min(2, "Description is empty"),
});

export type Image = {
  url: string;
  file: File | undefined;
};

const emptyValues = {
  name: "",
  categoryId: "",
  formattedPrice: "",
  price: 0,
  stock: 0,
  weight: 0,
  description: "",
};
const NewProductForm = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<Image | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { productMutation } = useProductMutation();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyValues,
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    if (!image?.file) {
      setError("Please upload a file");
      return;
    }
    const formData = new FormData();
    formData.set("image", image?.file);
    formData.set(
      "product",
      JSON.stringify({
        ...values,
      })
    );

    productMutation.mutate(formData);
  };

  useEffect(() => {
    if (productMutation.status === "success") {
      toast({
        title: "Product Created",
        description: "Successfully create a new product",
        duration: 2000,
      });
      form.reset(emptyValues);
      setImage(null);
    }
  }, [form, productMutation.status, toast]);

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = formatToIDR(value);
    form.setValue("formattedPrice", formattedValue);
    form.setValue("price", Number(numericValue));
    return formattedValue;
  };

  const setImageState = ({
    file,
    url,
  }: {
    edit?: boolean;
    file: File;
    url: string;
  }) => {
    setImage({ file, url });
  };
  return (
    <div className="w-full">
      <span className="text-sm">
        <Link to="/dashboard/product" className="text-muted-foreground">
          product /
        </Link>{" "}
        <Link to="/dashboard/product/create" className=" text-primary">
          new product
        </Link>
      </span>
      <div className="w-[768px] mx-auto">
        <h2 className="text-xl mb-10">Create New Product</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="w-full grid grid-cols-2 gap-2">
              <ProductFormField name="name" label="Product Name" />
              <ProductSelectFormField />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="formattedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={form.watch("formattedPrice") || ""}
                        onChange={(e) => {
                          const formattedValue = formatNumber(e.target.value);
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{}}
              />
              <ProductFormField name="stock" label="Stock" />
              <ProductFormField
                name="weight"
                label="Weight"
                description="The weight is in grams."
              />
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <ImageUpload
                    image={image as Image}
                    setImageState={setImageState}
                  />
                  <p className="text-xs text-primary">{error}</p>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about your product"
                          className="resize-none "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="px-8">
                <Loader2
                  className={
                    productMutation.isPending
                      ? "animate-spin w-4 h-4 mr-2"
                      : "hidden"
                  }
                />
                Create Product
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProductForm;
