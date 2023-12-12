import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const BackToCartDialog = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {t("checkoutPage.exitModal.header")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("checkoutPage.exitModal.desc")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <DialogClose asChild>
            <Button>{t("checkoutPage.exitModal.stayBtn")}</Button>
          </DialogClose>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "",
            })}
            to="/cart"
          >
            {t("checkoutPage.exitModal.leaveBtn")}
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackToCartDialog;
