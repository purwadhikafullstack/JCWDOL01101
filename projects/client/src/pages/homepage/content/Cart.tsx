import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import UserContext from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import React, { useContext } from "react";
import CartItem from "../components/CartItem";

const Cart = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const { data: cart } = useCart(user?.id!);
  return (
    <div className="flex w-full gap-8">
      <section className="flex-1">
        <h3 className="font-bold text-xl pt-4">Cart</h3>
        <div className="flex items-center justify-between border-b-4 pb-2">
          <span className="flex items-center gap-4">
            <Checkbox id="select" />{" "}
            <label htmlFor="select" className="text-muted-foreground">
              Select all
            </label>
          </span>
          <Button
            variant="ghost"
            className="text-primary font-semibold hover:text-primary/90"
          >
            Remove
          </Button>
        </div>
        <div className="py-4 space-y-4">
          {cart?.cartProducts &&
            cart?.cartProducts.map(({ product, quantity, id }, i) => (
              <React.Fragment key={product.id}>
                <CartItem
                  cartProductId={id}
                  userId={user?.id!}
                  cartId={cart.id}
                  product={product}
                  quantity={quantity}
                />
                <div
                  className={
                    i + 1 !== cart?.cartProducts.length
                      ? "border border-b-3"
                      : ""
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
              <p>Rp80.444</p>
            </span>
            <Separator />
            <span className="w-full font-bold flex items-center justify-between">
              <p className="text-lg">GrandTotal</p>
              <p>Rp80.444</p>
            </span>
            <Button className="w-full">Buy(1)</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
