import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartProduct } from "@/hooks/useCart";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  useCancelCartProductDeletion,
  useChageQty,
  useDeleteCartProduct,
} from "@/hooks/useCartMutation";
import { Button } from "@/components/ui/button";

type CartItemProps = {
  cartProductId: number;
  hasCart: boolean;
  cartId: number;
  quantity: number;
  product: Product;
  onChage: (key: string, value: boolean) => void;
  selectItem: boolean;
};

const CartItem = ({
  cartId,
  hasCart,
  product,
  quantity,
  onChage,
  selectItem,
  cartProductId,
}: CartItemProps) => {
  const qtyMutation = useChageQty();
  const { data: cartProduct } = useCartProduct(hasCart, product.id!);
  const stock = cartProduct
    ? cartProduct?.product?.inventory.reduce(
        (prev, curr) => prev + curr.stock,
        0
      )
    : 0;

  const deleteMutation = useDeleteCartProduct(cartProductId);
  const cancelDeleteMutation = useCancelCartProductDeletion(cartProductId);

  const deleteCart = () => {
    deleteMutation.mutate();
  };

  useEffect(() => {
    if (deleteMutation.isSuccess) {
      toast(
        (t) => (
          <span className="bg-black text-background">
            1 item has been deleted
            <button
              onClick={() => {
                toast.dismiss(t.id);
                cancelDeleteMutation.mutate();
              }}
              className="ml-2 bg-slate-900 px-2 py-1 rounded-md"
            >
              cancel
            </button>
          </span>
        ),
        {
          style: {
            padding: 1,
            background: "#000",
          },
          duration: 2000,
        }
      );
    }
  }, [deleteMutation.isSuccess]);
  return (
    <>
      <div key={product.id} className="w-full space-y-2">
        <div className="flex gap-2 items-center">
          <Checkbox
            checked={selectItem}
            onCheckedChange={(value) => {
              onChage(product.id!.toString(), !!value);
            }}
          />
          <div>
            <h3 className="font-bold">Toten Offical</h3>
            <p className="text-sm text-muted-foreground">Kota Makassar</p>
          </div>
        </div>
        <div className="flex items-start pl-6 gap-4">
          <img
            className="w-14 h-14 rounded-md object-contain"
            src={`${baseURL}/images/${product.productImage[0].image}`}
            alt={product.name}
          />
          <div>
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
            <p className="font-bold">{formatToIDR(product.price.toString())}</p>
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Button variant="ghost">
            <Trash2
              onClick={deleteCart}
              className="text-muted-foreground cursor-pointer hover:text-primary/80"
            />
          </Button>
          <div className="flex  items-center">
            <Button variant="ghost">
              <MinusCircle
                onClick={() => {
                  if (quantity > 1) {
                    qtyMutation.mutate({
                      cartId,
                      productId: product.id!,
                      qty: -1,
                    });
                  }
                }}
                className={`${
                  quantity > 1 ? "text-primary" : "text-muted-foreground"
                }  cursor-pointer`}
              />
            </Button>
            <p className="mx-2 p-2 select-none">{quantity}</p>
            <Button variant="ghost">
              <PlusCircle
                onClick={() => {
                  if (quantity < stock) {
                    qtyMutation.mutate({
                      cartId,
                      productId: product.id!,
                      qty: 1,
                    });
                  }
                }}
                className={`${
                  quantity < stock ? "text-primary" : "text-muted-foreground"
                }  cursor-pointer`}
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
