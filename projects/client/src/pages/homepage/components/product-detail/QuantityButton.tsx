import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatToIDR } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  quantity: number;
  setQuantity: (quantity: number) => void;
  price: number;
  totalStock: number;
  currentProductQtyInCart: number | undefined;
  inputRef: React.RefObject<HTMLInputElement>;
  error: string;
};

const QuantityButton = ({
  quantity,
  setQuantity,
  price,
  totalStock,
  currentProductQtyInCart,
  inputRef,
  error,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div className="grid lg:grid-cols-2 gap-2">
      <div>
        <div className="flex gap-2">
          <Button
            disabled={quantity <= 1}
            onClick={() => setQuantity(quantity - 1)}
            className="bg-black dark:border hover:bg-black/80 rounded-none"
          >
            <Minus />
          </Button>
          <Input
            disabled={totalStock <= 0}
            ref={inputRef}
            value={quantity}
            onChange={(e) => {
              if (quantity >= 0) {
                const numericValue = e.target.value.trim().replace(/\D/g, "");
                setQuantity(Number(numericValue));
              }
            }}
            className="rounded-none text-lg focus-visible:ring-black outline-none text-center"
          />
          <Button
            disabled={
              (currentProductQtyInCart || 0) + quantity >= totalStock ||
              totalStock <= 0
            }
            onClick={() => {
              if (quantity < totalStock) {
                setQuantity(quantity + 1);
              }
            }}
            className="bg-black dark:border hover:bg-black/80 rounded-none"
          >
            <Plus />
          </Button>
        </div>
        <p className="text-primary text-xs mt-2">{error}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="capitalize">
          {t("productDetailPage.options.subTotal")}
        </span>
        <p className="font-bold">{formatToIDR(price * quantity || 0)}</p>
      </div>
    </div>
  );
};

export default QuantityButton;
