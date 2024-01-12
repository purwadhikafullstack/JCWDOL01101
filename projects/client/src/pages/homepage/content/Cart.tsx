import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserContext } from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import CartItem from "../components/cart/CartItem";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "@/store/client/useStore";
import RemoveItemsDialog from "../components/cart/RemoveItemsDialog";
import ShoppingSummary from "../components/cart/ShoppingSummary";
import { useToggleAllSelectProduct } from "@/hooks/useCartMutation";
import { useTranslation } from "react-i18next";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import ProductCard from "../components/ProductCard";
import { Helmet } from "react-helmet";
import { useRecommendedProduct } from "@/hooks/useRecommendedProduct";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Cart = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const clearCheckout = useBoundStore((state) => state.clear);
  useEffect(() => {
    clearCheckout();
  }, []);

  const { data: cart } = useCart(user?.id!, !!user?.userCart);
  const { data: recommendedProducts, isLoading: isLoadingRecommended } =
    useRecommendedProduct(user?.id);
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
    <>
      <Helmet>
        <title>Cart | TOTEN</title>
      </Helmet>
      <div className="flex flex-col md:flex md:flex-row w-full gap-8">
        <div className="flex flex-col  flex-1">
          {carts.length > 0 ? (
            <section className="w-full">
              <h3 className="font-bold text-xl pt-4 uppercase">
                {t("cartPage.title")}
              </h3>
              <div className="flex items-center justify-between border-b-4 px-0">
                <div
                  onClick={() => {
                    if (cart) {
                      toggleAllSelectedCart.mutate(cart.cart.id);
                    }
                  }}
                  className="flex items-center gap-4 py-2 my-2 text-sm cursor-pointer px-0 lg:px-0 hover:bg-transparent"
                >
                  <Checkbox
                    id="select"
                    checked={selected.allTrue}
                    className="rounded-none"
                  />
                  <label
                    htmlFor="select"
                    className="text-muted-foreground  uppercase"
                  >
                    {t("cartPage.selectAll")}
                  </label>
                </div>
                {selected.someTrue && (
                  <RemoveItemsDialog cartId={cart?.cart.id!} />
                )}
              </div>

              <div className="py-4 space-y-4">
                {user &&
                  carts &&
                  carts.map((cp, i) => (
                    <React.Fragment key={cp.id}>
                      <CartItem cartProduct={cp} hasCart={!!user.userCart} />
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
            <div className="container flex flex-col justify-center items-center mb-24 md:mb-0">
              <img
                src="/ilus/empty-cart.svg"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
              <h2 className="text-xl font-bold">{t("cartPage.empty.title")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("cartPage.empty.desc")}
              </p>
              <Button
                onClick={() => navigate("/products")}
                className="px-10 w-max mt-4 rounded-none bg-black border dark:border-border hover:bg-black/80 font-bold"
              >
                {t("cartPage.empty.btn")}
              </Button>
            </div>
          )}
        </div>
        {carts.length > 0 && (
          <ShoppingSummary
            cartId={cart?.cart.id}
            someTrue={selected.someTrue}
            totalPrice={totalPrice}
            totalQuantity={totalQuantity}
          />
        )}
      </div>
      <>
        <h3 className="font-bold my-2 mt-8 pt-4 uppercase">
          {t("cartPage.misc.title")}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {isLoadingRecommended ? (
            <NewestProductSekeleton product={isDesktop ? 6 : 2} />
          ) : (
            <>
              {recommendedProducts &&
                recommendedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </>
          )}
        </div>
      </>
    </>
  );
};

export default Cart;
