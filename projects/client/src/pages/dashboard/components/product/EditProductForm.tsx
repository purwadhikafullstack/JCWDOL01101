import React from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import SelectFormField from "./SelectFormField";
import { Button } from "@/components/ui/button";
import ProductFormTextarea from "./ProductFormTextarea";
import { useBoundStore } from "@/store/client/useStore";
import PriceFormField from "./PriceFormField";
import WeightFormField from "./WeightFormField";
import { useEditProduct } from "@/hooks/useProductMutation";
import { useToast } from "@/components/ui/use-toast";
import ProductNameField from "./ProductNameField";
import z from "zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import EditImageForm from "./EditImageForm";
import { baseURL } from "@/service";
import ProductSizeField from "./ProductSizeField";
import { Helmet } from "react-helmet";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is empty").max(70),
  categoryId: z.string().min(1, "Category is empty"),
  formattedPrice: z.string().min(1, "Price is empty"),
  size: z.number().array().min(1, "Size is empty"),
  price: z.coerce.number().min(1),
  stock: z.string().min(1, "Stock is empty"),
  weight: z.coerce.number().min(1, "Weight is empty"),
  description: z.string().trim().min(2, "Description is empty").max(2000),
});

const emptyValues = {
  name: "",
  categoryId: "",
  formattedPrice: "",
  price: 0,
  size: [],
  stock: "",
  weight: 0,
  description: "",
};

const EditProductForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditing = !!slug;

  React.useEffect(() => {
    if (!slug) {
      navigate("/dashboard/product");
    }
  }, [slug, navigate]);

  const [button, setButton] = React.useState("");
  const { data: pd } = useProduct(slug || "");
  const editImages = useBoundStore((state) => state.editImages);
  const clearImage = useBoundStore((state) => state.clearImage);
  const setPayloadImageLength = useBoundStore(
    (state) => state.setPayloadImageLength
  );
  const setEditImageForm = useBoundStore((state) => state.setEditImageForm);
  const [error, setError] = React.useState<string | null>(null);
  const editMutation = useEditProduct(slug || "");

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: emptyValues,
  });
  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const editFiles = editImages.map((image) =>
      image !== null ? { imageId: image.imageId, file: image.file } : null
    );
    const editFilterImage = editFiles.filter(
      (image) => image !== null && image.file
    );

    if (editFilterImage.length <= 0 && !isEditing) {
      setError("Please provide an image.");
      return;
    }
    const formData = new FormData();
    editFilterImage.forEach((filter) => {
      if (filter?.file) {
        formData.append("images", filter?.file);
      }
    });
    formData.set("currentImage", JSON.stringify(editFilterImage));
    formData.set("product", JSON.stringify({ ...values }));
    editMutation.mutate(formData);
  };

  React.useEffect(() => {
    if (pd && pd.product) {
      const { product } = pd;
      form.setValue("name", product.name);
      form.setValue("categoryId", String(product.categoryId));
      form.setValue("price", product.price);
      form.setValue("formattedPrice", formatToIDR(String(product.price)));
      form.setValue("stock", String(product.stock));
      const size = new Set<number>();
      for (const inv of pd.product.inventory) {
        if (!size.has(inv.sizeId)) {
          size.add(inv.sizeId);
        }
      }
      form.setValue("size", Array.from(size));
      form.setValue("weight", product.weight);
      form.setValue("description", product.description);
      if (product.productImage.length > 0) {
        product.productImage.forEach(({ image, id }, i) => {
          setEditImageForm(
            {
              imageId: id,
              file: null,
              url: `${baseURL}/images/${image}`,
            },
            i
          );
        });
      }
    }
  }, [pd]);

  React.useEffect(() => {
    if (pd && pd.product) {
      setPayloadImageLength(pd.product.productImage.length);
      if (pd.product.productImage.length > 0) {
        clearImage();
        pd.product.productImage.forEach(({ image, id }, i) => {
          setEditImageForm(
            {
              imageId: id,
              file: null,
              url: `${baseURL}/images/${image}`,
            },
            i
          );
        });
      }
    }
  }, [pd]);

  React.useEffect(() => {
    if (editMutation.status === "success") {
      toast({
        title: "Product Edited",
        description: "Successfully edit product",
        duration: 1000,
      });
      if (button === "save") {
        setError("");
        clearImage();
        setButton("");
        return navigate("/dashboard/product");
      }
    }
  }, [editMutation.status]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Edit Product</title>
      </Helmet>
      <div className="container space-y-4 mb-24">
        <span className="text-sm">
          <Link to="/dashboard/product" className="text-muted-foreground">
            products /
          </Link>{" "}
          <Link to="/dashboard/product/create" className=" text-primary">
            edit product
          </Link>
        </span>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Edit Product</h3>
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
                isAlreadySold={pd ? pd.totalSold > 0 : false}
              />
              <SelectFormField />
              <EditImageForm error={error} />
              <ProductSizeField
                edit={true}
                mutationStatus={editMutation.isSuccess}
              />
              <ProductFormTextarea />
              <PriceFormField />
              <WeightFormField />
            </form>
          </Form>
        </div>
        <div className="w-full flex justify-end items-center gap-2">
          <Button
            onClick={() => {
              clearImage();
              navigate(-1);
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setButton("save")}
            form="product"
            type="submit"
            className="px-8"
          >
            {editMutation.isPending && (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditProductForm;
