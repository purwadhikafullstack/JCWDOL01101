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
import { ArchiveRestore, Loader2 } from "lucide-react";
import { Product } from "@/hooks/useProduct";
import { useSearchParams } from "react-router-dom";
import { STATUS } from "@/hooks/useReviewMutation";
import { useChangeStatus } from "@/hooks/useProductMutation";
import { Button } from "@/components/ui/button";

type Props = {
  product: Product;
  dropdownChange: (open: boolean) => void;
};
const RestoreDropdownDialog = ({ product, dropdownChange }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [params] = useSearchParams();
  const status = (String(params.get("status")) as STATUS) || "";
  const warehouseId = params.get("warehouse") || undefined;
  const changeStatusMutation = useChangeStatus();

  const handleRestoreProduct = () => {
    if (product.id && status && warehouseId) {
      changeStatusMutation.mutate({
        warehouseId,
        productId: product.id,
        status: "ACTIVE",
        previousStatus: status,
      });
    }
  };

  React.useEffect(() => {
    if (changeStatusMutation.isSuccess) {
      dropdownChange(false);
      setOpen(false);
    }
  }, [changeStatusMutation.isSuccess]);
  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        dropdownChange(state);
      }}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="w-full cursor-pointer text-muted-foreground"
        >
          <ArchiveRestore className="w-4 h-4 mr-2" />
          Restore
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Restore: {product.name}</DialogTitle>
          <DialogDescription>
            You are about to restore a previously{" "}
            {status === "DEACTIVATED" ? "deactivated" : "removed"} product. This
            action will make the product available for purchase again. Please
            confirm your action
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2  items-center">
          <Button onClick={handleRestoreProduct}>
            <Loader2
              className={
                changeStatusMutation.isPending
                  ? "animate-spin w-4 h-4 mr-2"
                  : "hidden"
              }
            />
            Restore
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

export default RestoreDropdownDialog;
