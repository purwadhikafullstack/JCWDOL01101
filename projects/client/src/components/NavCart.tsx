import React, { useContext } from "react";
import NavDropdown from "./NavDropdown";
import { ShoppingCart, ShoppingCartIcon } from "lucide-react";
import { useUserContext } from "@/context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import { baseURL } from "@/service";
import { cn, formatToIDR } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

const NavCart = ({ setIsDim }: { setIsDim: (x: boolean) => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { data: carts } = useCart(user?.id!, !!user?.userCart);

  const totalProducts: number = carts?.totalQuantity || 0;
  const cartProducts = carts?.cart ? carts.cart.cartProducts : [];
  return (
    <>
      <div className="hidden md:block">
        <NavDropdown
          path="/cart"
          counter={totalProducts}
          icon={<ShoppingCartIcon />}
          title="Cart"
          setIsDim={setIsDim}
        >
          <div className="w-[350px]">
            {totalProducts > 0 ? (
              <>
                <div className="w-full p-2 text-sm flex items-center justify-between">
                  <p className="text-base ">
                    {t("navbar.cart.total")} ({totalProducts})
                  </p>
                  <Link to="/cart" className="font-semibold text-primary">
                    {t("navbar.cart.link")}
                  </Link>
                </div>
                <Separator className="mb-2" />
                <div className="space-y-2">
                  {cartProducts.map(({ id, product, quantity }, i) => (
                    <div key={id} className="py-1">
                      <div className="w-full flex justify-between items-center">
                        <img
                          src={`${baseURL}/images/${product.productImage[0].image}`}
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
                <div className="p-2 w-[280px] mx-auto">
                  <img
                    className="w-[120px] mx-auto"
                    src="/ilus/empty.svg"
                    alt="cart ilustration"
                  />
                  <p className="font-bold text-center">
                    {t("navbar.cart.empty.header")}
                  </p>
                  <p className="text-center text-xs text-muted-foreground">
                    {t("navbar.cart.empty.desc")}
                  </p>
                </div>
              </>
            )}
          </div>
        </NavDropdown>
      </div>
      <div className="block md:hidden relative">
        {totalProducts
          ? totalProducts >= 1 && (
              <span
                className={cn(
                  totalProducts < 10 ? "px-[6px]" : null,
                  "absolute top-1 z-50 right-0  text-[0.6rem] p-[4px] leading-3 grid  place-content-center h-[18px] w-[18px] bg-primary rounded-full text-primary-foreground font-semibold  border-2 border-background"
                )}
              >
                {totalProducts}
              </span>
            )
          : null}
        <Button
          onClick={() => navigate("/cart")}
          variant="ghost"
          size="sm"
          className="relative"
        >
          <ShoppingCart />
        </Button>
      </div>
    </>
  );
};

export default NavCart;
