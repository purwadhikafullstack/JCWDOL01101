import React, { useContext, useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import UserContext from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import CartItem from "../components/cart/CartItem";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "@/store/client/useStore";
import RemoveItemsDialog from "../components/cart/RemoveItemsDialog";
import ShoppingSummary from "../components/cart/ShoppingSummary";
import { useToggleAllSelectProduct } from "@/hooks/useCartMutation";
import { useGetClosestWarehouse } from "@/hooks/useWarehouse";
const Cart = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;

  const clearCheckout = useBoundStore((state) => state.clear);
  useEffect(() => {
    clearCheckout();
  }, []);

  const { data: cart } = useCart(user?.id!, !!user?.userCart);
  const carts = cart?.cart.cartProducts || [];

  const totalQuantity = cart?.totalQuantity || 0;
  const totalPrice = cart?.totalPrice || 0;

  const toggleAllSelectedCart = useToggleAllSelectProduct();
  const [selected, setSelected] = useState({ allTrue: false, someTrue: false });

  useEffect(() => {
    if (carts.length > 0) {
      const { allTrue, someTrue } = carts.reduce(
        (acc, value) => ({
          allTrue: acc.allTrue && value.selected,
          someTrue: acc.someTrue || value.selected,
        }),
        { allTrue: true, someTrue: false }
      );

      setSelected({ allTrue, someTrue });
    }
  }, [carts]);
  return (
    <div className="flex w-full gap-8">
      {carts.length > 0 ? (
        <section className="flex-1">
          <h3 className="font-bold text-xl pt-4">Cart</h3>
          <div className="flex items-center justify-between border-b-4 px-0">
            <div
              onClick={() => {
                if (cart) {
                  toggleAllSelectedCart.mutate(cart.cart.id);
                }
              }}
              className={buttonVariants({
                variant: "ghost",
                className:
                  "flex items-center gap-4 cursor-pointer px-0 lg:px-0 hover:bg-transparent",
              })}
            >
              <Checkbox id="select" checked={selected.allTrue} />
              <label htmlFor="select" className="text-muted-foreground">
                Select all
              </label>
            </div>
            {selected.someTrue && <RemoveItemsDialog cartId={cart?.cart.id!} />}
          </div>

          <div className="py-4 space-y-4">
            {carts &&
              carts.map(({ product, quantity, selected, id }, i) => (
                <React.Fragment key={product.id}>
                  <CartItem
                    cartProductId={id}
                    hasCart={!!user?.userCart}
                    cartId={cart?.cart.id!}
                    product={product}
                    quantity={quantity}
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
          someTrue={selected.someTrue}
          totalPrice={totalPrice}
          totalQuantity={totalQuantity}
        />
      )}
    </div>
  );
};

export default Cart;
