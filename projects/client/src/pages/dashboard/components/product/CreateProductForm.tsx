import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import SelectFormField from "./SelectFormField";
import ImageForm from "./ImageForm";
import { Button } from "@/components/ui/button";
import ProductFormTextarea from "./ProductFormTextarea";
import { useBoundStore } from "@/store/client/useStore";
import PriceFormField from "./PriceFormField";
import WeightFormField from "./WeightFormField";
import { useProductMutation } from "@/hooks/useProductMutation";
import { useToast } from "@/components/ui/use-toast";
import ProductNameField from "./ProductNameField";
import z from "zod";
import { Link, useNavigate } from "react-router-dom";
import ProductSizeField from "./ProductSizeField";
import { Helmet } from "react-helmet";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is empty").max(70),
  categoryId: z.string().min(1, "Category is empty"),
  formattedPrice: z.string().min(1, "Price is empty"),
  size: z.number().array().min(1, "Size is empty"),
  price: z.coerce.number().min(1),
  weight: z.coerce.number().min(1, "Weight is empty"),
  description: z
    .string()
    .trim()
    .min(80, "Min description is 80 char")
    .max(2000),
});

const emptyValues = {
  name: "",
  categoryId: "",
  formattedPrice: "",
  size: [],
  price: 0,
  weight: 0,
  description: "",
};

const CreateProductForm = () => {
  const { toast } = useToast();
  const images = useBoundStore((state) => state.images);
  const clearImage = useBoundStore((state) => state.clearImage);
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [button, setButton] = useState("");
  const { productMutation } = useProductMutation();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyValues,
  });
  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const files = images.map((image) => (image !== null ? image.file : null));
    const filterImage = files.filter((image) => image !== null);
    if (filterImage.length <= 0) {
      setError("Please provide an image.");
      return;
    }
    const formData = new FormData();
    filterImage.forEach((file) => {
      if (file) {
        formData.append("images", file);
      }
    });
    formData.set(
      "product",
      JSON.stringify({ ...values, categoryId: Number(values.categoryId) })
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
      setError("");
      clearImage();
      if (button === "save") {
        setButton("");
        return navigate("/dashboard/product");
      }
    }
  }, [productMutation.status, button]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Create Product</title>
      </Helmet>
      <div className="container space-y-4 mb-24">
        <span className="text-sm">
          <Link to="/dashboard/product" className="text-muted-foreground">
            products /
          </Link>{" "}
          <Link to="/dashboard/product/create" className=" text-primary">
            create product
          </Link>
        </span>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Add Product</h3>
        </div>
        <div className="border rounded-lg p-4">
          <Form {...form}>
            <form
              id="product"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <ProductNameField
                name="name"
                label="Product Name"
                description=""
              />
              <SelectFormField />
              <ImageForm error={error} />
              <ProductSizeField mutationStatus={productMutation.isSuccess} />
              <ProductFormTextarea />
              <PriceFormField />
              <WeightFormField />
            </form>
          </Form>
        </div>
        <div className="w-full flex justify-end items-center gap-2">
          <Button
            onClick={() => {
              navigate(-1);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setButton("add")}
            form="product"
            type="submit"
            variant="outline"
          >
            {productMutation.isPending && button === "add" && (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            )}
            Save & Add New
          </Button>
          <Button
            onClick={() => setButton("save")}
            form="product"
            type="submit"
            className="px-6"
          >
            {productMutation.isPending && button === "save" && (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            )}
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateProductForm;
