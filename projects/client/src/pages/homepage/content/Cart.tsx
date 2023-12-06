import React, { useContext, useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import UserContext from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import CartItem from "../components/cart/CartItem";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "@/store/client/useStore";
import RemoveItemsDialog from "../components/cart/RemoveItemsDialog";
import ShoppingSummary from "../components/cart/ShoppingSummary";
const Cart = () => {
  const clearCheckout = useBoundStore((state) => state.clear);
  clearCheckout();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const { data: cart } = useCart(user?.id!, !!user?.userCart);
  const cartProducts = useMemo(() => cart?.cart.cartProducts || [], [cart]);
  const totalQuantity = cart?.totalQuantity || 0;
  const totalPrice = cart?.totalPrice || 0;

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
      {cartProducts.length > 0 ? (
        <section className="flex-1">
          <h3 className="font-bold text-xl pt-4">Cart</h3>
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
              <RemoveItemsDialog
                cartId={cart?.cart.id!}
                selectedItem={selectedItem}
              />
            )}
          </div>

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
        </section>
      ) : (
        <div className="container flex flex-col justify-center items-center">
          <img src="/ilus/empty-cart.svg" className="w-[300px] mx-auto" />
          <h2 className="text-xl font-bold">Your Cart is Empty</h2>
          <p className="text-sm text-muted-foreground">
            Make your dreams come true now!
          </p>
          <Button
            onClick={() => navigate("/category")}
            className="px-8 w-max mt-2"
          >
            Shop Now
          </Button>
        </div>
      )}
      {cartProducts.length > 0 && (
        <ShoppingSummary
          someTrue={someTrue}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
        />
      )}
    </div>
  );
};

export default Cart;
