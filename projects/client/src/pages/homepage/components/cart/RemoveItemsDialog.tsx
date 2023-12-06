import { buttonVariants, Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useDeleteAllCartProduct } from "@/hooks/useCartMutation";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const RemoveItemsDialog = ({
  cartId,
  selectedItem,
}: {
  cartId: number;
  selectedItem: { [key: string]: boolean };
}) => {
  const deleteAllCart = useDeleteAllCartProduct(cartId);
  useEffect(() => {
    if (deleteAllCart.isSuccess) {
      toast(
        () => (
          <span className="bg-black text-background">
            your items has been removed
          </span>
        ),
        {
          style: {
            background: "#000",
          },
        }
      );
    }
  }, [deleteAllCart.isSuccess]);
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "ghost",
          className:
            "text-primary font-semibold hover:text-primary/90 hover:bg-transparent",
        })}
      >
        Remove
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Remove item?</DialogTitle>
          <DialogDescription className="text-center">
            The selected item will be remove from your cart
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:flex-col gap-2">
          <DialogClose asChild>
            <Button
              onClick={() => {
                const deletedKeys = Object.keys(selectedItem).filter(
                  (key) => selectedItem[key] === true
                );
                deleteAllCart.mutate(deletedKeys);
              }}
            >
              {deleteAllCart.isPending ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                "Remove Item"
              )}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveItemsDialog;
