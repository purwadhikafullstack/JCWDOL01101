import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/useProduct";
import { Delete } from "lucide-react";
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
        Delete <Delete className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );
};

export default DeleteProduct;
