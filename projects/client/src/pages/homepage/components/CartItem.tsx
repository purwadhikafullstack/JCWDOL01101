import { Checkbox } from "@/components/ui/checkbox";
import { useCartProduct } from "@/hooks/useCart";
import { useChageQty, useDeleteCartProduct } from "@/hooks/useCartMutation";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import React from "react";

const CartItem = ({
  cartId,
  quantity,
  product,
  userId,
  cartProductId,
}: {
  cartProductId: number;
  userId: number;
  cartId: number;
  quantity: number;
  product: Product;
}) => {
  const qtyMutation = useChageQty();
  // const { data: cartProduct } = useCartProduct(product.id!);
  const deleteMutation = useDeleteCartProduct(cartProductId);
  // const stock = cartProduct ? cartProduct?.product?.stock : 0;
  return (
    <>
      <div key={product.id} className="w-full space-y-2">
        <div className="flex gap-2 items-center">
          <Checkbox />
          <div>
            <h3 className="font-bold">Toten Offical</h3>
            <p className="text-sm text-muted-foreground">Kota Makassar</p>
          </div>
        </div>
        <div className="flex items-start pl-6 gap-4">
          <img
            className="w-14 h-14 rounded-md object-contain"
            src={`${baseURL}/${product.image}`}
            alt={product.name}
          />
          <div>
            <p>{product.name}</p>
            <p className="font-bold">{formatToIDR(product.price.toString())}</p>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Trash2
            onClick={() => {
              deleteMutation.mutate();
            }}
            className="text-muted-foreground mr-10"
          />
          <div className="flex  items-center">
            <MinusCircle
              onClick={() => {
                qtyMutation.mutate({
                  cartId,
                  productId: product.id!,
                  qty: -1,
                });
              }}
              className={`${
                quantity > 0 ? "text-primary" : "text-muted-foreground"
              }  text cursor-pointer`}
            />
            {/* <Input
              className="w-[50px] text-center border-none focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-0"
            /> */}
            <p>{quantity}</p>
            <PlusCircle
              onClick={() => {
                qtyMutation.mutate({
                  cartId,
                  productId: product.id!,
                  qty: 1,
                });
              }}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
