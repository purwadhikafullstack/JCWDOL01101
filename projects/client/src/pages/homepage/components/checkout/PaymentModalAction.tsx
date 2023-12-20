import { Button } from "@/components/ui/button";
import { useDokuPaymentIntent } from "@/hooks/useDoku";
import { formatToIDR } from "@/lib/utils";
import { Loader, ShieldCheck } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
type Props = {
  cartId: number;
  paymentMethodId: string;
  shippingFee: number;
  totalPrice: number;
  closestWarehouse: any;
  handlePaymentPending: (state: boolean) => void;
};
const PaymentModalAction = ({
  cartId,
  totalPrice,
  shippingFee,
  closestWarehouse,
  paymentMethodId,
  handlePaymentPending,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createPayment = useDokuPaymentIntent();
  const handleCreatePayment = () => {
    if (closestWarehouse) {
      createPayment.mutate({
        cartId,
        payment: paymentMethodId,
        shippingFee: Number(shippingFee),
        totalPrice: Number(totalPrice) + Number(shippingFee),
        warehouseId: closestWarehouse.data.data.id,
      });
    }
  };

  useEffect(() => {
    if (createPayment.isSuccess) {
      const data = createPayment.data;
      window.open(data.virtual_account_info.how_to_pay_page, "_blank");
      return navigate("/transactions");
    }
  }, [createPayment.isSuccess]);

  useEffect(() => {
    handlePaymentPending(createPayment.isPending);
  }, [createPayment.isPending]);
  return (
    <div className="bg-background sticky bottom-0 ">
      <div className=" w-full grid grid-cols-2 bg-gradient-to-tr from-background to-primary/20 dark:to-background py-4 px-2">
        <div>
          <p>{t("checkoutPage.paymentModal.total")}</p>
          <b className="text-sm">{formatToIDR(+totalPrice + shippingFee)}</b>
        </div>
        <Button
          disabled={createPayment.isPending}
          onClick={handleCreatePayment}
          className="lg:px-10 lg:py-6 font-bold"
        >
          {createPayment.isPending ? (
            <span className="animate-pulse flex items-center">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {t("checkoutPage.paymentModal.loading")}
            </span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 mr-2" />
              {t("checkoutPage.paymentModal.payBtn")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentModalAction;
