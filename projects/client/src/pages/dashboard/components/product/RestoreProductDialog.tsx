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
import { Button } from "@/components/ui/button";
import { ArchiveRestore, Loader2 } from "lucide-react";
import { useChangeAllStatus } from "@/hooks/useProductMutation";
import { useSearchParams } from "react-router-dom";
import { STATUS } from "@/hooks/useReviewMutation";
import Hashids from "hashids";
import { useToast } from "@/components/ui/use-toast";
type Props = {
  disabled: boolean;
};
const RestoreProductDialog = ({ disabled }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const hashids = new Hashids("TOTEN", 10);
  const [searchParams] = useSearchParams();
  const changeAllStatusMutation = useChangeAllStatus();
  const status = searchParams.get("status") as STATUS;
  const warehouse = searchParams.get("warehouse");
  const handleRestoreAllProduct = () => {
    if (status !== "ACTIVE" && warehouse) {
      const decodedWarehouseId = Number(hashids.decode(warehouse));
      changeAllStatusMutation.mutate({
        warehouseId: decodedWarehouseId,
        status: "ACTIVE",
        previousStatus: status,
      });
    }
  };

  React.useEffect(() => {
    if (changeAllStatusMutation.isSuccess) {
      setOpen(false);
      toast({
        title: "Product Restore",
        description: `All product has been restored successfully`,
        duration: 2000,
      });
    }
  }, [changeAllStatusMutation.isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline">
          <ArchiveRestore className="w-4 h-4 mr-2" />
          Restore All
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore All Product</DialogTitle>
          <DialogDescription>
            You are about to restore all previously{" "}
            {status === "DEACTIVATED" ? "deactivated" : "removed"} product. This
            action will make the product available for purchase again. Please
            confirm your action
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <Button onClick={handleRestoreAllProduct}>
            <Loader2
              className={
                changeAllStatusMutation.isPending
                  ? "animate-spin w-4 h-4 mr-2"
                  : "hidden"
              }
            />
            Restore All
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestoreProductDialog;
