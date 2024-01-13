import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Address } from "@/hooks/useAddress";
import { useClosestWarehouse } from "@/hooks/useCheckoutMutation";
import { useBoundStore } from "@/store/client/useStore";
import { ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PaymentModalItems from "./PaymentModalItems";
import PaymentModalAction from "./PaymentModalAction";
import PaymentModalExit from "./PaymentModalExit";

const paymentMethods = [
  {
    img: "/ilus/bri.png",
    method: "Bank BRI",
    id: "bri",
  },
  {
    img: "/ilus/bca.png",
    method: "Bank BCA",
    id: "bca",
  },
  {
    img: "/ilus/doku_va.png",
    method: "ALTO, ATM Bersama, Prima (DOKU VA)",
    id: "doku",
  },
];

const PaymentModal = ({
  cartId,
  address,
  totalPrice,
}: {
  cartId: number;
  address: Address | undefined;
  totalPrice: number;
}) => {
  const { t } = useTranslation();
  const shippingFee = useBoundStore((state) => state.totalShipping);
  const isLoading = useBoundStore((state) => state.isLoading);
  const [paymentMethod, setPaymentMethods] = React.useState("0");
  const [show, setShow] = React.useState(false);
  const [exit, setExit] = React.useState(false);
  const [paymentPending, setPaymentPending] = React.useState(false);
  const checkClosestWarehouse = useClosestWarehouse();

  const handlePaymentPending = (state: boolean) => {
    setPaymentPending(state);
  };

  const onCheckClosestWarehouse = () => {
    if (address) {
      checkClosestWarehouse.mutate({ lat: address.lat, lng: address.lng });
    }
  };

  React.useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  React.useEffect(() => {
    const invoice = localStorage.getItem("invoice");
    if (checkClosestWarehouse.isSuccess || invoice) {
      setShow(true);
    }
  }, [checkClosestWarehouse.isSuccess]);

  return (
    <>
      <Button
        disabled={isLoading || checkClosestWarehouse.isError}
        onClick={onCheckClosestWarehouse}
        className="font-bold w-full lg:py-6 text-base lg:text-lg rounded-lg"
      >
        {checkClosestWarehouse.isPending ? (
          <span className="animate-pulse">
            {t("checkoutPage.summary.loading")}
          </span>
        ) : (
          t("checkoutPage.summary.paymentBtn")
        )}
      </Button>
      {checkClosestWarehouse.isError && (
        <div className="text-center text-sm">
          <p className="text-red-400">
            {t("checkoutPage.paymentModal.outOfStockError")}
            <Link
              to="/products"
              className="flex gap-2 items-center justify-center underline text-primary"
            >
              <ExternalLink className="w-4 h-4" />
              {t("checkoutPage.paymentModal.outOfStockLink")}
            </Link>
          </p>
        </div>
      )}
      <>
        {show && (
          <div className="top-0 m-0 left-0 z-50 w-full h-screen fixed bg-background/80">
            <div className="w-full flex justify-center items-center h-full">
              <div className="w-[95%] lg:w-[500px] overflow-hidden transition-all duration-200 relative">
                <PaymentModalExit
                  exit={exit}
                  setExit={setExit}
                  setShow={setShow}
                />
                <div className="w-full max-h-[500px] border bg-background rounded-lg relative overflow-y-auto transition-all duration-300">
                  <div className="absolute top-0 left-0 p-4 flex gap-2 items-center">
                    <Button
                      disabled={paymentPending}
                      variant="ghost"
                      onClick={() => setExit(!exit)}
                      className="cursor-pointer  p-2"
                    >
                      <X />
                    </Button>
                    <b>{t("checkoutPage.paymentModal.header")}</b>
                  </div>
                  <div className="w-full mt-10 p-4">
                    <b>{t("checkoutPage.paymentModal.sub")}</b>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethods}
                    >
                      {paymentMethods.map((pm, i) => (
                        <div
                          key={pm.id}
                          className="flex p-2 rounded-md gap-2 items-center hover:bg-muted py-2"
                        >
                          <RadioGroupItem id={pm.id} value={String(i)} />
                          <Label
                            htmlFor={pm.id}
                            className="flex gap-2 items-center cursor-pointer"
                          >
                            <img
                              className=" h-8"
                              src={pm.img}
                              alt={pm.method}
                            />
                            {pm.method}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  {address && (
                    <PaymentModalItems
                      paymentMethod={paymentMethods[+paymentMethod].method}
                      totalPrice={totalPrice}
                      shippingFee={shippingFee}
                      cartId={cartId}
                      address={address}
                    />
                  )}
                  <PaymentModalAction
                    cartId={cartId}
                    totalPrice={totalPrice}
                    shippingFee={shippingFee}
                    closestWarehouse={checkClosestWarehouse.data}
                    paymentMethodId={paymentMethods[+paymentMethod].id}
                    handlePaymentPending={handlePaymentPending}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default PaymentModal;
