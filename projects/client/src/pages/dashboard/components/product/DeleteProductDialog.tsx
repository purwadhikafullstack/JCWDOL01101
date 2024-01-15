import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Product } from "@/hooks/useProduct";
import DeleteProduct from "./DeleteProduct";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Delete } from "lucide-react";

type Props = {
  product: Product;
};
const DeleteProductDialog = ({ product }: Props) => {
  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="w-full cursor-pointer text-muted-foreground"
        >
          <Delete className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">
            Delete Product: {product.name} ?
          </DialogTitle>
          <DialogDescription>
            You are about to delete the product {product.name}. Please confirm
            if you wish to proceed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-col w-full space-y-2">
            <DeleteProduct productId={Number(product.id)} />
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
