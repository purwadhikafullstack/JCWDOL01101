import { Button } from "@/components/ui/button";
import { formatToIDR } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useNavigate } from "react-router-dom";

const ShoppingSummary = ({
  someTrue,
  totalPrice,
  totalQuantity,
}: {
  someTrue: boolean;
  totalPrice: number;
  totalQuantity: number;
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-[320px] relative ">
      <div className="w-ful sticky top-[77px] ">
        <div className="w-full h-full px-4 py-6 border rounded-lg space-y-2">
          <p className="font-bold">Shopping Summary</p>
          <span className="w-full flex text-sm items-center justify-between text-muted-foreground">
            <p>Total Price(item)</p>
            <p>{formatToIDR(totalPrice.toString())}</p>
          </span>
          <Separator />
          <span className="w-full font-bold flex items-center justify-between">
            <p className="text-lg">GrandTotal</p>
            <p>{formatToIDR(totalPrice.toString())}</p>
          </span>
          <Button
            disabled={!someTrue}
            onClick={() => {
              navigate("/checkout");
            }}
            className="w-full"
          >
            Buy({totalQuantity})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingSummary;
