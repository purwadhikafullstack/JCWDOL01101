import React, { useContext, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import UserContext from "@/context/UserContext";
import { useActiveAddress } from "@/hooks/useAddress";
import { useCart } from "@/hooks/useCart";
import { formatToIDR } from "@/lib/utils";
import { useBoundStore } from "@/store/client/useStore";
import ActiveAddress from "../components/checkout/ActiveAddress";
import BackToCartDialog from "../components/checkout/BackToCartDialog";
import CheckoutItem from "../components/checkout/CheckoutItem";
import PaymentModal from "../components/checkout/PaymentModal";
import { useGetClosestWarehouse } from "@/hooks/useWarehouse";
import { useNavigate } from "react-router-dom";
import { useSelectedItem } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import SelectAddressDialog from "@/components/SelectAddressDialog";
import { Trans, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

export type Dialog = {
  main: boolean;
  add: boolean;
  edit: boolean;
};

const Checkout = () => {
  const { t } = useTranslation();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const { data: cart } = useCart(user?.id!, !!user?.userCart);

  const navigate = useNavigate();
  useEffect(() => {
    if (cart && !Boolean(cart.cart)) {
      return navigate("/");
    }
  }, [cart]);

  const { data: activeAddress } = useActiveAddress(!!user?.id);
  const { data: closestWarehouse } = useGetClosestWarehouse({
    lat: activeAddress?.lat,
    lng: activeAddress?.lng,
  });
  const { data: selectedCartProducts } = useSelectedItem(cart?.cart.id!);
  const cartProductsLength = selectedCartProducts?.length || 0;
  const totalPrice = selectedCartProducts
    ? selectedCartProducts.reduce(
        (prev, curr) => prev + curr.product.price * curr.quantity,
        0
      )
    : 0;
  const shippingFee = useBoundStore((state) => state.totalShipping);
  const shippingTotal = Number(shippingFee) + Number(totalPrice);

  return (
    <>
      <Helmet>
        <title>Chekout | TOTEN</title>
      </Helmet>
      <div className="py-4  border-b">
        <div className="w-full container">
          <BackToCartDialog>
            <span className="text-lg font-bold text-primary flex gap-2 items-center cursor-pointer">
              当店 <p className="hidden lg:block">| Toten</p>
            </span>
          </BackToCartDialog>
        </div>
      </div>
      <div className="container mb-24">
        <div className="flex flex-col lg:flex lg:flex-row w-full gap-8">
          <section className="flex-1">
            <h3 className="font-bold text-xl pt-4">
              {t("checkoutPage.header")}
            </h3>
            <h4 className="font-bold my-2 mt-8">
              {t("checkoutPage.shipping")}
            </h4>
            <Separator />
            <ActiveAddress activeAddress={activeAddress} />
            <SelectAddressDialog>
              <Button variant="secondary">
                {activeAddress
                  ? t("checkoutPage.addressBtn")
                  : t("checkoutPage.emptyAddressBtn")}
              </Button>
            </SelectAddressDialog>

            <>
              {selectedCartProducts &&
                selectedCartProducts.map(
                  ({ product, id, quantity, size }, i) => (
                    <CheckoutItem
                      key={id}
                      index={i}
                      size={size}
                      length={cartProductsLength}
                      product={product}
                      quantity={quantity}
                      warehouse={closestWarehouse}
                      activeAddress={activeAddress}
                    />
                  )
                )}
            </>
          </section>
          <div className="w-full lg:w-[420px] relative">
            <div className="w-ful lg:sticky lg:top-[100px]">
              <div className="w-full h-full px-4 py-6 lg:mt-[100px] border rounded-lg">
                <div className="space-y-3 mb-5">
                  <b className="font-bold">{t("checkoutPage.summary.title")}</b>
                  <div className="text-sm">
                    <div className="flex gap-2 justify-between items-center">
                      <span className="flex gap-2 items-center">
                        <Trans
                          i18nKey="checkoutPage.summary.totalPrice"
                          values={{ total: cartProductsLength }}
                        >
                          Total Price (
                          {`${cartProductsLength} ${
                            cartProductsLength > 1 ? "products" : "product"
                          }`}
                          )
                        </Trans>
                      </span>
                      <p>{formatToIDR(totalPrice.toString())}</p>
                    </div>
                    <div className="flex gap-2 justify-between items-center">
                      <span className="flex gap-2 items-center">
                        {t("checkoutPage.summary.totalShippingFee")}
                      </span>
                      <p>{formatToIDR(shippingFee.toString())}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2 justify-between items-center">
                    <b>{t("checkoutPage.summary.shippingTotal")}</b>
                    <span className="font-bold text-lg">
                      {formatToIDR(shippingTotal.toString())}
                    </span>
                  </div>
                </div>
                {user && (
                  <PaymentModal
                    cartId={user.userCart.id}
                    address={activeAddress}
                    totalPrice={totalPrice}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
