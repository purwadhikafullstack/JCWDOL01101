import React, { useContext } from "react";
import NavDropdown from "./NavDropdown";
import { ShoppingCartIcon } from "lucide-react";
import UserContext from "@/context/UserContext";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { baseURL } from "@/service";
import { formatToIDR } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

const NavCart = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const { data: carts } = useCart(user?.id!, !!user?.userCart);

  const totalProducts: number = carts?.totalQuantity || 0;
  const cartProducts = carts?.cart ? carts.cart.cartProducts : [];
  return (
    <NavDropdown
      path="/cart"
      totalProduct={totalProducts}
      icon={<ShoppingCartIcon />}
      title="Cart"
      setIsDim={setIsDim}
    >
      <div className="w-[350px]">
        {totalProducts > 0 ? (
          <>
            <div className="w-full p-2 text-sm flex items-center justify-between">
              <p className="text-base ">Total ({totalProducts})</p>
              <Link to="/cart" className="font-semibold text-primary">
                Cart
              </Link>
            </div>
            <Separator className="mb-2" />
            <div className="space-y-2">
              {cartProducts.map(({ product, quantity }, i) => (
                <div key={product.id} className="py-1">
                  <div className="w-full flex justify-between items-center">
                    <img
                      src={`${baseURL}/${product.image}`}
                      className="w-10 h-10"
                      alt={product.name}
                    />
                    <div>
                      <p className="font-bold overflow-hidden text-ellipsis whitespace-nowrap w-[200px]">
                        {product.name}
                      </p>
                      <span className="text-xs flex gap-2">
                        <p>
                          {quantity} {quantity > 1 ? "items" : "item"}
                        </p>
                        <p>({product.weight}grams)</p>
                      </span>
                    </div>
                    <span className="text-primary">
                      {formatToIDR(product.price.toString())}
                    </span>
                  </div>
                  {i + 1 !== cartProducts.length && (
                    <Separator className="mt-2" />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="p-2 w-[280px]">
              <img
                className="w-[120px] mx-auto"
                src="/ilus/empty.svg"
                alt="cart ilustration"
              />
              <p className="font-bold text-center">Cart is empty.</p>
              <p className="text-center text-xs text-muted-foreground">
                Your cart is feeling light as a feather – ready and waiting for
                your delightful picks to fill it with joy!
              </p>
            </div>
          </>
        )}
      </div>
    </NavDropdown>
  );
};

export default NavCart;
