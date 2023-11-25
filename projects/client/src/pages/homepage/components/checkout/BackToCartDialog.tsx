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

const BackToCartDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Back To Cart?
          </DialogTitle>
          <DialogDescription className="text-center">
            Discard all changes and return to cart?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <DialogClose asChild>
            <Button>Stay On This Page</Button>
          </DialogClose>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "",
            })}
            to="/cart"
          >
            Back And Discard Changes
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BackToCartDialog;
