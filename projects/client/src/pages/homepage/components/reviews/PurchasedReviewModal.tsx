import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "vaul";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/custom-dialog";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const PurchasedReviewModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="block md:hidden">
        <Drawer.Root shouldScaleBackground>
          <Drawer.Trigger asChild>
            <Button
              variant="outline"
              className="border-black uppercase mt-6 px-10 rounded-none"
            >
              {t("reviewsPage.allowReview.btn")}
            </Button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[50%] mt-24 fixed bottom-0 left-0 right-0 z-50">
              <div className="p-4 bg-white rounded-t-[10px] flex-1">
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                <div className="max-w-md mx-auto">
                  <Drawer.Title className="font-bold text-center mb-4 ">
                    {t("reviewsPage.allowReview.title")}
                  </Drawer.Title>
                  <p className="text-zinc-600 mb-2 text-center">
                    {t("reviewsPage.allowReview.desc")}
                  </p>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
      <div className="hidden md:block">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-black uppercase mt-6 px-10 rounded-none"
            >
              Write Review
            </Button>
          </DialogTrigger>
          <DialogContent className="lg:rounded-none">
            <DialogHeader>
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="border-black rounded-none h-6 px-0 self-end"
              >
                <X />
              </Button>
              <DialogTitle>Review Unavailable</DialogTitle>
              <DialogDescription>
                Only customers who have purchased this product can submit a
                review. Thank you for understanding.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default PurchasedReviewModal;
