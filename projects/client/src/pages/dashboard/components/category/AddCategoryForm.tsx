import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useCategoryMutation } from "@/hooks/useCategoryMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import CategoryImageForm from "./CategoryImageForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Image } from "../product/ProductImage";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});
const AddCategoryForm = () => {
  const [image, setImage] = useState<Image | null>(null);
  const [error, setError] = useState("");
  const categoryMutation = useCategoryMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    if (!image) {
      setError("Image is empty");
    }
    if (image && image.file) {
      formData.set("images", image.file);
      formData.set("category", JSON.stringify({ ...values }));
      categoryMutation.mutate(formData);
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (categoryMutation.isSuccess) {
      form.reset({ name: "" });
      setImage(null);
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
        <Button
          type="submit"
          className="float-right uppercase rounded-none px-10"
        >
          {categoryMutation.isPending && (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AddCategoryForm;
