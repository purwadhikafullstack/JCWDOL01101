import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  useCategoryMutation,
  useEditCategoryMutation,
} from "@/hooks/useCategoryMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import CategoryImageForm from "./CategoryImageForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Image } from "../product/ProductImage";
import { useFetchCategory } from "@/hooks/useCategory";
import { useSearchParams } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});
const EditCategoryForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const edit = !!searchParams.get("edit") || false;
  const [image, setImage] = useState<Image | null>(null);
  const [error, setError] = useState("");
  const categoryMutation = useEditCategoryMutation(slug);

  const { data: category } = useFetchCategory(slug);
  useEffect(() => {
    if (edit && category) {
      setImage({ file: null, url: category.image });
    }
  }, [edit, category]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    if (!image) {
      setError("Image is empty");
    }
    if (image && category) {
      if (image.file) {
        formData.set("images", image.file);
      } else {
        formData.set("images", image.url);
      }
      formData.set("category", JSON.stringify({ ...values }));
      categoryMutation.mutate({ id: category.id, data: formData });
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  useEffect(() => {
    if (category) {
      form.setValue("name", category.name);
    }
  }, [category]);

  useEffect(() => {
    if (categoryMutation.isSuccess) {
      form.reset({ name: "" });
      setImage(null);
      setSearchParams((params) => {
        params.delete("slug");
        params.delete("edit");
        return params;
      });
    }
  }, [categoryMutation.isSuccess]);

  const handleImageError = (msg: string) => {
    setImage(null);
    setError(msg);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4">
                <FormLabel>Category Name</FormLabel>
                <FormControl className="col-span-3">
                  <Input {...field} className="rounded-none" />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-4">
          <label className={error && "text-primary"}>Image</label>
          <div className="col-span-3">
            <CategoryImageForm
              error={error}
              image={image}
              setError={handleImageError}
              setImage={setImage}
            />
            <p className="text-primary mt-2 text-sm">{error}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() =>
              setSearchParams((params) => {
                params.delete("slug");
                params.delete("edit");
                return params;
              })
            }
          >
            CANCEL
          </Button>
          <Button type="submit" className="uppercase rounded-none px-10">
            {categoryMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            edit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCategoryForm;
