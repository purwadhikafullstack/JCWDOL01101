import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/useProduct";
import { Loader2 } from "lucide-react";
import React, { FormEvent } from "react";

const DeleteProduct = ({ productId }: { productId: number }) => {
  const deleteProduct = useDeleteProduct(productId);
  const onDeleteProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteProduct.mutate();
  };
  return (
    <form onSubmit={onDeleteProduct}>
      <Button type="submit" variant="destructive" className="cursor-pointer ">
        <Loader2
          className={
            deleteProduct.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
          }
        />
        Yes, delete product
      </Button>
    </form>
  );
};

export default DeleteProduct;
