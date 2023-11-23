import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import UserContext from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import React, { useContext, useEffect, useMemo, useState } from "react";
import CartItem from "../components/CartItem";
import { useDeleteAllCartProduct } from "@/hooks/useCartMutation";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatToIDR } from "@/lib/utils";
import { Loader } from "lucide-react";
const Cart = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const { data: cart } = useCart(user?.id!);
  const deleteAllCart = useDeleteAllCartProduct(cart?.cart.id!);
  const cartProducts = useMemo(() => cart?.cart.cartProducts || [], [cart]);
  const totalQuantity = cart?.totalQuantity || 0;
  const totalPrice = cart?.totalPrice || 0;

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
  const defaultSelectedItem = useMemo(() => {
    return cartProducts.reduce(
      (acc: { [key: string]: boolean }, { productId }) => {
        acc[productId] = true;
        return acc;
      },
      {}
    );
  }, [cartProducts]);

  const [selectedItem, setSelectedItem] = useState<{ [key: string]: boolean }>(
    defaultSelectedItem
  );
  const allTrue = useMemo(
    () =>
      Object.keys(selectedItem).length > 0 &&
      Object.values(selectedItem).every((value) => value),
    [selectedItem]
  );
  const someTrue = useMemo(
    () => Object.values(selectedItem).some((value) => value),
    [selectedItem]
  );
  const handleSelectedItem = (key: string, value: boolean) => {
    setSelectedItem({ ...selectedItem, [key]: value });
  };

  return (
    <div className="flex w-full gap-8">
      <section className="flex-1">
        <h3 className="font-bold text-xl pt-4">Cart</h3>
        <Dialog>
          <div className="flex items-center justify-between border-b-4 px-0">
            <div
              onClick={() => {
                const newSelectedItem: { [key: string]: boolean } = {};
                cartProducts.forEach((v) => {
                  newSelectedItem[v.productId] = !selectedItem[v.productId];
                });
                setSelectedItem(newSelectedItem);
              }}
              className={buttonVariants({
                variant: "ghost",
                className:
                  "flex items-center gap-4 cursor-pointer px-0 lg:px-0 hover:bg-transparent",
              })}
            >
              <Checkbox id="select" checked={allTrue} />
              <label htmlFor="select" className="text-muted-foreground">
                Select all
              </label>
            </div>
            {someTrue && (
              <DialogTrigger
                className={buttonVariants({
                  variant: "ghost",
                  className:
                    "text-primary font-semibold hover:text-primary/90 hover:bg-transparent",
                })}
              >
                Remove
              </DialogTrigger>
            )}
          </div>
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

        <div className="py-4 space-y-4">
          {cartProducts &&
            cartProducts.map(({ product, quantity, id }, i) => (
              <React.Fragment key={product.id}>
                <CartItem
                  cartProductId={id}
                  hasCart={!!user?.userCart}
                  cartId={cart?.cart.id!}
                  product={product}
                  quantity={quantity}
                  selectItem={selectedItem[product.id!]}
                  onChage={handleSelectedItem}
                />
                <div
                  className={
                    i + 1 !== cartProducts.length ? "border border-b-3" : ""
                  }
                />
              </React.Fragment>
            ))}
        </div>
        <div>
          <h3 className="font-bold text-xl mt-10">Rekomendasi Untukmu</h3>
        </div>
      </section>
      <div className="w-[320px] relative ">
        <div className="w-ful sticky top-[77px] ">
          <div className="w-full h-full px-4 py-6 border rounded-lg space-y-3">
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
            <Button className="w-full">Buy({totalQuantity})</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
