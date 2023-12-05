import React, { useContext, useEffect, useMemo, useState } from "react";
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
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }

  const clearCheckout = useBoundStore((state) => state.clear);
  useEffect(() => {
    clearCheckout();
  }, []);

  const initializeCart = useBoundStore((state) => state.initializeCarts);
  const toggleAllSelectedCart = useBoundStore(
    (state) => state.toggleSelectedCarts
  );
  const { user } = userContext;
  const { data: cart } = useCart(user?.id!, !!user?.userCart);

  const carts = useBoundStore((state) => state.carts);
  useEffect(() => {
    const currentCart = cart?.cart.cartProducts || [];
    initializeCart(currentCart.map((cart) => ({ ...cart, selected: true })));
  }, [cart]);

  const totalQuantity = cart?.totalQuantity || 0;
  const totalPrice = cart?.totalPrice || 0;

  const allTrue = carts.every((value) => value.selected);
  const someTrue = carts.some((value) => value.selected);

  return (
    <div className="flex w-full gap-8">
      {carts.length > 0 ? (
        <section className="flex-1">
          <h3 className="font-bold text-xl pt-4">Cart</h3>
          <div className="flex items-center justify-between border-b-4 px-0">
            <div
              onClick={() => {
                toggleAllSelectedCart();
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
            {someTrue && <RemoveItemsDialog cartId={cart?.cart.id!} />}
          </div>

          <div className="py-4 space-y-4">
            {carts &&
              carts.map(({ product, quantity, selected, id }, i) => (
                <React.Fragment key={product.id}>
                  <CartItem
                    index={i}
                    cartProductId={id}
                    hasCart={!!user?.userCart}
                    cartId={cart?.cart.id!}
                    product={product}
                    quantity={quantity}
                    selected={selected}
                  />
                  <div
                    className={
                      i + 1 !== carts.length ? "border border-b-3" : ""
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
            onClick={() => navigate("/products")}
            className="px-8 w-max mt-2"
          >
            Shop Now
          </Button>
        </div>
      )}
      {carts.length > 0 && (
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
