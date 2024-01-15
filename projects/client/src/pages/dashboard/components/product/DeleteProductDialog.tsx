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
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Delete, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useGetWarehouseById } from "@/hooks/useWarehouse";
import {
  useChangeStatus,
  useChangeStatusInventory,
} from "@/hooks/useProductMutation";
import Hashids from "hashids";

type Props = {
  dropdownChange: (open: boolean) => void;
  product: Product;
};
const DeleteProductDialog = ({ product, dropdownChange }: Props) => {
  const hashids = new Hashids("TOTEN", 10);
  const [open, setOpen] = React.useState(false);
  const [params] = useSearchParams();
  const warehouseId = params.get("warehouse") || undefined;
  const { data: warehouse } = useGetWarehouseById(warehouseId);

  const deleteProduct = useChangeStatus();
  const deleteProductInventory = useChangeStatusInventory();
  const onDeleteProduct = () => {
    deleteProduct.mutate({
      productId: product.id,
      status: "DELETED",
    });
  };

  const onDeleteProductInventory = () => {
    if (warehouseId) {
      const decodeWarehouseId = Number(hashids.decode(warehouseId));
      deleteProductInventory.mutate({
        productId: product.id,
        warehouseId: decodeWarehouseId,
        status: "DELETED",
      });
    }
  };
  React.useEffect(() => {
    if (deleteProduct.isSuccess || deleteProductInventory.isSuccess) {
      dropdownChange(false);
      setOpen(false);
    }
  }, [deleteProduct.isSuccess, deleteProductInventory.isSuccess]);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        dropdownChange(state);
      }}
    >
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
            <div className="flex gap-2 w-full">
              <Button
                onClick={onDeleteProductInventory}
                className="cursor-pointer w-full"
              >
                <Loader2
                  className={
                    deleteProductInventory.isPending
                      ? "animate-spin w-4 h-4 mr-2"
                      : "hidden"
                  }
                />
                <div>
                  <p>Delete on ({warehouse?.name})</p>
                </div>
              </Button>
              <Button
                onClick={onDeleteProduct}
                className="cursor-pointer w-full"
              >
                <Loader2
                  className={
                    deleteProduct.isPending
                      ? "animate-spin w-4 h-4 mr-2"
                      : "hidden"
                  }
                />
                Delete on all warehouse
              </Button>
            </div>
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
