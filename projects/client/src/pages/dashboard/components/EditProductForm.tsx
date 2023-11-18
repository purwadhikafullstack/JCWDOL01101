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
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEditProduct, useProduct } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import ImageUpload from "./ImageUpload";
import ProductFormField from "./ProductFormField";
import ProductSelectFormField from "./ProductSelectFormField";
import { Image, productSchema } from "./NewProductForm";
import { useToast } from "@/components/ui/use-toast";

const emptyValues = {
  name: "",
  category: "",
  formattedPrice: "",
  price: 0,
  stock: 0,
  weight: 0,
  description: "",
};
const EditProductForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { productId } = useParams();

  useEffect(() => {
    if (!Number(productId)) {
      navigate("/dashboard/product");
    }
  }, [productId, navigate]);
  const { data: product } = useProduct(Number(productId));

  const [image, setImage] = useState<Image | null>({
    file: undefined,
    url: product?.image || "",
    new: !!productId,
  });

  const productMutation = useEditProduct(Number(productId));

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyValues,
  });
  const onSubmit = (values: z.infer<typeof productSchema>) => {
    if (image?.new && !image?.file) {
      setError("Please upload a file");
      return;
    }

    const formData = new FormData();
    if (image?.new) {
      formData.set(
        "product",
        JSON.stringify({
          ...values,
        })
      );
      formData.set("image", image?.file as File);
    } else {
      formData.set(
        "product",
        JSON.stringify({
          ...values,
          image: image?.url as string,
        })
      );
    }
    productMutation.mutate(formData);
  };

  useEffect(() => {
    if (productMutation.isSuccess) {
      toast({
        title: "Product Updated",
        description: "Successfully update product",
        duration: 3000,
      });
    }
  }, [productMutation.isSuccess, toast]);

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = formatToIDR(value);
    form.setValue("formattedPrice", formattedValue);
    form.setValue("price", Number(numericValue));

    return formattedValue;
  };

  useEffect(() => {
    if (product) {
      form.setValue("name", product.name);
      form.setValue("categoryId", String(product.categoryId));
      form.setValue("price", product.price);
      form.setValue("formattedPrice", formatToIDR(String(product.price)));
      form.setValue("stock", product.stock);
      form.setValue("weight", product.weight);
      form.setValue("description", product.description);
      setImage({ new: false, file: undefined, url: product.image });
    }
  }, [product, form]);

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
        <h2 className="text-xl mb-10">Edit Product</h2>
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
                    setImage={setImage}
                    isEdit={true}
                    mutationSuccess={productMutation.isSuccess}
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
              <Button type="submit">
                <Loader2
                  className={
                    productMutation.isPending
                      ? "animate-spin w-4 h-4 mr-2"
                      : "hidden"
                  }
                />
                Modify
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProductForm;
