import React from "react";
import { Button } from "@/components/ui/button";
import { formatToIDR } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelectedItem } from "@/hooks/useCheckout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WEIGHT_LIMIT = 30000;
type Props = {
  cartId: number | undefined;
  someTrue: boolean;
};

const ShoppingSummary = ({ cartId, someTrue }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: selectedCart } = useSelectedItem(cartId);
  const [open, setOpen] = React.useState(false);
  return (
    <div className="w-full md:w-[320px] relative ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bag Weight Exceeded</DialogTitle>
            <DialogDescription>
              Your shopping bag has exceeded the weight limit for our standard
              shipping. Please consider removing some items or splitting your
              purchase into two orders. This will ensure the safe delivery of
              your new clothes and help avoid any potential shipping issues.
              Thank you for shopping with us!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="sticky top-[100px] ">
        <div className="w-full h-full px-4 py-6 border space-y-2 rounded-lg">
          <p className="font-bold">{t("cartPage.summary.title")}</p>
          {selectedCart && (
            <>
              <span className="w-full flex text-sm items-center justify-between text-muted-foreground">
                <p>Weight</p>
                <p>{selectedCart.weightTotal / 1000}Kg</p>
              </span>
              <span className="w-full flex text-sm items-center justify-between text-muted-foreground">
                <p>{t("cartPage.summary.total")}</p>
                <p>{formatToIDR(selectedCart.totalPrice)}</p>
              </span>
              <Separator />
              <span className="w-full font-bold flex items-center justify-between">
                <p className="text-lg">{t("cartPage.summary.grandTotal")}</p>
                <p>{formatToIDR(selectedCart.totalPrice)}</p>
              </span>
            </>
          )}
          <Button
            disabled={!someTrue}
            onClick={() => {
              if (selectedCart) {
                if (selectedCart.weightTotal > WEIGHT_LIMIT) {
                  setOpen(true);
                } else if (selectedCart.cartProducts.length > 0) {
                  navigate("/checkout");
                }
              }
            }}
            className="w-full"
          >
            {t("cartPage.summary.buyBtn")}({selectedCart?.totalQuantity || 0})
          </Button>
          {selectedCart && selectedCart.weightTotal > WEIGHT_LIMIT && (
            <p className="text-primary text-sm">
              Bag exceeds {WEIGHT_LIMIT / 1000}Kg limit. Remove items or split
              order for safe delivery. Thanks!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingSummary;
