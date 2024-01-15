import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  exit: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setExit: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaymentModalExit = ({ exit, setShow, setExit }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className={`absolute w-full transform ${
          exit ? "translate-y-20" : "-translate-y-[300px]"
        } duration-300 top-0 transition-all ease-in-out flex  justify-center z-50`}
      >
        <div className="w-[300px] h-max bg-background p-4 border rounded-lg">
          <img src="/ilus/payment.svg" className="w-28 mx-auto" />
          <p className="text-lg font-bold text-center pb-4">
            {t("checkoutPage.paymentModal.exitModal.header")}
          </p>
          <Button onClick={() => setExit(false)} className="w-full">
            {t("checkoutPage.paymentModal.exitModal.continueBtn")}
          </Button>
          <Button
            onClick={() => {
              setExit(false);
              setShow(false);
            }}
            variant="outline"
            className="w-full mt-2"
          >
            {t("checkoutPage.paymentModal.exitModal.exitBtn")}
          </Button>
        </div>
      </div>
      {exit && (
        <div className="z-40 w-full h-full absolute left-0 top-0 bg-background/80" />
      )}
    </>
  );
};

export default PaymentModalExit;
