import React, { useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/UserContext";
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
import { Trans, useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
import SelectCourier from "../components/checkout/SelectCourier";

export type Dialog = {
  main: boolean;
  add: boolean;
  edit: boolean;
};
const WEIGHT_LIMIT = 30000;

const Checkout = () => {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const { data: cart } = useCart(user?.id!, !!user?.userCart);
  const { data: selectedCartProducts } = useSelectedItem(cart?.cart.id);

  const navigate = useNavigate();
  useEffect(() => {
    if (cart && !Boolean(cart.cart)) {
      return navigate("/");
    }
  }, [cart]);

  useEffect(() => {
    if (
      selectedCartProducts &&
      selectedCartProducts.weightTotal >= WEIGHT_LIMIT
    ) {
      return navigate("/cart");
    }
  }, [selectedCartProducts]);

  const { data: activeAddress } = useActiveAddress(!!user?.id);
  const { data: closestWarehouse } = useGetClosestWarehouse({
    lat: activeAddress?.lat,
    lng: activeAddress?.lng,
  });
  const weightTotal = selectedCartProducts
    ? selectedCartProducts.weightTotal
    : 0;

  useEffect(() => {
    if (
      selectedCartProducts &&
      selectedCartProducts.cartProducts &&
      selectedCartProducts.cartProducts.length === 0
    ) {
      return navigate("/cart");
    }
  }, [selectedCartProducts]);
  const cartProductsLength = selectedCartProducts?.cartProducts?.length || 0;
  const totalPrice = selectedCartProducts?.totalPrice || 0;

  const shippingFee = useBoundStore((state) => state.totalShipping);
  const shippingTotal = Number(shippingFee) + Number(totalPrice);

  return (
    <>
      <Helmet>
        <title>Checkout | TOTEN</title>
      </Helmet>
      <div className="py-4  border-b fixed inset-0 bg-background h-max">
        <div className="w-full container">
          <BackToCartDialog>
            <span className="text-lg font-bold text-primary flex gap-2 items-center cursor-pointer">
              当店 <p className="hidden lg:block">| Toten</p>
            </span>
          </BackToCartDialog>
        </div>
      </div>
      <div className="container my-16">
        <div className="flex flex-col lg:flex lg:flex-row w-full gap-8">
          <section className="flex-1">
            <h3 className="font-bold text-xl pt-4 mb-8">
              {t("checkoutPage.header")}
            </h3>
            <div className="flex flex-col lg:flex-row gap-2">
              <ActiveAddress activeAddress={activeAddress} />
              {closestWarehouse && closestWarehouse.warehouseAddress && (
                <SelectCourier
                  weightTotal={weightTotal}
                  address={activeAddress}
                  origin={closestWarehouse.warehouseAddress.cityId}
                />
              )}
            </div>
            <Separator className="my-2" />
            <>
              {selectedCartProducts &&
                selectedCartProducts.cartProducts &&
                selectedCartProducts.cartProducts.map((cp, i) => (
                  <CheckoutItem
                    key={cp.id}
                    cp={cp}
                    index={i}
                    length={cartProductsLength}
                    warehouse={closestWarehouse}
                  />
                ))}
            </>
          </section>
          <div className="w-full lg:w-[420px] relative">
            <div className="w-ful lg:sticky lg:top-[170px]">
              <div className="w-full h-full px-4 py-6 lg:mt-[100px] border rounded-lg">
                <div className="space-y-3 mb-5">
                  <b className="font-bold">{t("checkoutPage.summary.title")}</b>
                  <div className="text-sm">
                    <div className="flex gap-2 justify-between items-center">
                      <span className="flex gap-2 items-center">
                        <Trans
                          i18nKey="checkoutPage.summary.totalPrice"
                          values={{
                            total: selectedCartProducts?.totalQuantity || 0,
                          }}
                        >
                          Total Price (
                          {`${selectedCartProducts?.totalQuantity || 0} ${
                            selectedCartProducts?.totalQuantity || 0 > 1
                              ? "products"
                              : "product"
                          }`}
                          )
                        </Trans>
                      </span>
                      <p>{formatToIDR(totalPrice)}</p>
                    </div>
                    <div className="flex gap-2 justify-between items-center">
                      <span className="flex gap-2 items-center">
                        {t("checkoutPage.summary.totalShippingFee")}
                      </span>
                      <p>{formatToIDR(shippingFee)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2 justify-between items-center">
                    <b>{t("checkoutPage.summary.shippingTotal")}</b>
                    <span className="font-bold text-lg">
                      {formatToIDR(shippingTotal)}
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
      <Toaster />
    </>
  );
};

export default Checkout;
