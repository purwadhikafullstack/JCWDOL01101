import { Button } from "@/components/ui/button";
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
import { useTranslation } from "react-i18next";

const RemoveItemsDialog = ({ cartId }: { cartId: number }) => {
  const { t } = useTranslation();
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
      <DialogTrigger asChild>
        <Button
          className="text-primary px-0 font-semibold hover:text-primary/90 hover:bg-transparent uppercase"
          variant="ghost"
        >
          {t("cartPage.remove")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {t("cartPage.removeModal.header")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("cartPage.removeModal.desc")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:flex-col gap-2">
          <DialogClose asChild>
            <Button
              onClick={() => {
                deleteAllCart.mutate();
                deleteAllCart.mutate();
              }}
            >
              {deleteAllCart.isPending ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                t("cartPage.removeModal.acceptBtn")
              )}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t("cartPage.removeModal.cancelBtn")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveItemsDialog;
