import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useChangeStatusInventory } from "@/hooks/useProductMutation";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/hooks/useProduct";
import { Button } from "@/components/ui/button";
import { EyeOff, Loader2 } from "lucide-react";
type Props = {
  product: Product;
};

const DeactivateProductDialog = ({ product }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [params] = useSearchParams();
  const warehouseId = params.get("warehouse") || undefined;
  const changeProductInventory = useChangeStatusInventory();
  const handleDeactivatedProduct = () => {
    if (product.id && warehouseId) {
      changeProductInventory.mutate({
        warehouseId,
        productId: product.id,
        status: "DEACTIVATED",
      });
    }
  };
  React.useEffect(() => {
    if (changeProductInventory.isSuccess) {
      setOpen(false);
    }
  }, [changeProductInventory.isSuccess]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="w-full cursor-pointer text-muted-foreground"
        >
          <EyeOff className="w-4 h-4 mr-2" />
          Deactivated
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Deactivated: {product.name}</DialogTitle>
          <DialogDescription>
            Your are about to deactivated product {product.name}
            deactivated. It will no longer be available for view until
            reactivated.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2  items-center">
          <Button onClick={handleDeactivatedProduct}>
            <Loader2
              className={
                changeProductInventory.isPending
                  ? "animate-spin w-4 h-4 mr-2"
                  : "hidden"
              }
            />
            Deactivated
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateProductDialog;
