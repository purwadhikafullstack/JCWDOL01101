import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import z, { ZodError, string } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { useProductMutation } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";

export const productSchema = z.object({
  name: z.string().min(2),
  category: string().min(1),
  formattedPrice: z.string().min(1),
  price: z.coerce.number().min(1),
  stock: z.coerce.number().min(1),
  weight: z.coerce.number().min(1),
  description: z.string().min(2),
});

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
type Image = {
  url: string;
  file: File | undefined;
};
const NewProductForm = () => {
  const [image, setImage] = useState<Image | null>(null);
  const [error, setError] = useState<string | null>(null);
  const productMutation = useProductMutation();
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      formattedPrice: "",
      price: 0,
      stock: 0,
      weight: 0,
      description: "",
    },
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
    console.log(values);
    productMutation.mutate(formData);
  };

  useEffect(() => {
    if (productMutation.status === "success") {
      form.reset({
        name: "",
        category: "",
        formattedPrice: "",
        price: 0,
        stock: 0,
        weight: 0,
        description: "",
      });
      setImage(null);
    }
  }, [form, productMutation.status]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => setError("file reading was aborted");
      reader.onerror = () => setError("file reading has failed");
      reader.onload = () => {
        setImage({ url: reader.result as string, file });
        const fileSchema = z.object({
          name: z.string(),
          type: z
            .string()
            .regex(
              /^image\/(jpeg|png)$/,
              "Only accepting .jpg, .jpeg, and png"
            ),
          size: z.number().max(5 * 1024 * 1024, "File too big"),
        });

        try {
          const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
          };
          fileSchema.parse(fileData);

          setError(null);
        } catch (err) {
          if (err instanceof ZodError) {
            setError(err.errors[0].message);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = formatToIDR(value);
    form.setValue("formattedPrice", formattedValue);
    form.setValue("price", Number(numericValue));

    return formattedValue;
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your product display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <div>
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      The weight is in grams. <br /> (1000 grams/1kg)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <section className="w-full h-full">
                <FormLabel>Image</FormLabel>
                <div
                  {...getRootProps()}
                  className={`${
                    error && "border-primary"
                  } w-full h-[200px] rounded-md mt-2 group border overflow-hidden`}
                >
                  {!error && image ? (
                    <img
                      src={image.url as string}
                      alt="pick"
                      className="w-full h-full object-contain group-hover:scale-105 transition-all duration-200"
                    />
                  ) : (
                    <div
                      className={`${
                        error ? "text-primary" : "text-muted-foreground"
                      } w-full  h-full flex cursor-pointer justify-center items-center flex-col`}
                    >
                      <Upload
                        className="transform transition-all duration-200 group-hover:-translate-y-1"
                        strokeWidth={1}
                      />
                      <p className="text-xs max-w-[150px] text-center">
                        Drag & Drop or Click to upload image
                      </p>
                    </div>
                  )}
                  <input {...getInputProps()} />
                </div>
                {error ? (
                  <p className="text-xs text-primary">{error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Max File Size: 5MB, only JPG, JPEG, PNG are supported.
                  </p>
                )}
              </section>
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
              Create
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewProductForm;
