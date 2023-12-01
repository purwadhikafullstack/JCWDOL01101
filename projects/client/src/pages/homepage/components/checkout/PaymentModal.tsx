import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cartProducts } from "@/context/UserContext";
import { Address } from "@/hooks/useAddress";
import { useDokuPaymentIntent } from "@/hooks/useDoku";
import { useClosestWarehouse } from "@/hooks/useOrderMutation";
import { formatToIDR } from "@/lib/utils";
import { useBoundStore } from "@/store/client/useStore";
import { ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

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
  userId,
  address,
  totalPrice,
  cartProducts,
}: {
  userId: number;
  address: Address | undefined;
  totalPrice: number;
  cartProducts: cartProducts[];
}) => {
  const navigate = useNavigate();
  const shippingFee = useBoundStore((state) => state.totalShipping);
  const isLoading = useBoundStore((state) => state.isLoading);
  const shipping = useBoundStore((state) => state.fee);
  const [paymentMethod, setPaymentMethods] = useState("0");
  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);
  const checkClosestWarehouse = useClosestWarehouse();
  const createPayment = useDokuPaymentIntent();

  const handleCreatePayment = () => {
    createPayment.mutate({
      totalPrice: Number(totalPrice) + Number(shippingFee),
      payment: paymentMethods[Number(paymentMethod)].id,
    });
  };

  const onSubmit = () => {
    if (address) {
      checkClosestWarehouse.mutate({ lat: address.lat, lng: address.lng });
    }
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  useEffect(() => {
    if (checkClosestWarehouse.isSuccess) {
      setShow(true);
    }
  }, [checkClosestWarehouse.isSuccess]);

  useEffect(() => {
    if (createPayment.isSuccess) {
      const data = createPayment.data;
      window.open(data.virtual_account_info.how_to_pay_page, "_blank");
      return navigate("/order");
    }
  }, [createPayment.isSuccess]);
  return (
    <>
      <Button
        disabled={isLoading}
        onClick={onSubmit}
        className="font-bold w-full py-6 text-lg rounded-lg"
      >
        {checkClosestWarehouse.isPending ? (
          <span className="animate-pulse">preparing your stock</span>
        ) : (
          "Choose Payment"
        )}
      </Button>
      <>
        {show && (
          <div className="top-0  m-0 left-0 z-30 w-full h-screen fixed bg-black/80">
            <div className="w-full flex justify-center items-center h-full">
              <div className="w-[500px] overflow-hidden  transition-all duration-200 relative">
                <div
                  className={`absolute w-full transform ${
                    exit ? "translate-y-20" : "-translate-y-[300px]"
                  } duration-300 top-0 transition-all ease-in-out flex  justify-center z-50`}
                >
                  <div className="w-[300px] h-max bg-white p-4 border rounded-lg">
                    <img src="/ilus/payment.svg" className="w-28 mx-auto" />
                    <p className="text-lg font-bold text-center pb-4">
                      Exit Payment Page ?
                    </p>
                    <Button onClick={() => setExit(false)} className="w-full">
                      Continue Pay
                    </Button>
                    <Button
                      onClick={() => {
                        setExit(false);
                        setShow(false);
                      }}
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Exit Page
                    </Button>
                  </div>
                </div>
                {exit && (
                  <div className="z-40 w-full h-full absolute left-0 top-0 bg-black/60"></div>
                )}
                <div
                  className={` w-full max-h-[500px]  bg-white rounded-lg relative overflow-y-auto transition-all duration-300 `}
                >
                  <div className="absolute top-0 left-0 p-4 flex gap-2 items-center">
                    <span
                      onClick={() => setExit(!exit)}
                      className="cursor-pointer z-50 p-2"
                    >
                      <X />
                    </span>
                    <b>Payment</b>
                  </div>
                  <div className="w-full mt-10 p-4">
                    <b>Payment Method</b>
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
                  <div className="mb-8 p-4 space-y-4">
                    <b className="text-sm">Summary</b>
                    <ul className="text-sm text-muted-foreground">
                      <li className="flex gap-2 justify-between items-center">
                        <span>Payment Method</span>
                        <span>{paymentMethods[+paymentMethod].method}</span>
                      </li>
                      <Separator className="my-2" />
                      <li className="flex gap-2 justify-between items-center">
                        <span>Total Price ({cartProducts.length})</span>
                        <b>{formatToIDR(totalPrice.toString())}</b>
                      </li>
                      <li className="flex gap-2 justify-between items-center">
                        <span>Shipping Fee</span>
                        <b>{formatToIDR(shippingFee.toString())}</b>
                      </li>
                    </ul>
                    <div>
                      <b className="text-sm">Purchased Items</b>
                      <Separator className="my-2" />
                      <div className="space-y-3">
                        {cartProducts.map(({ product, id, quantity }) => (
                          <div
                            key={id}
                            className="text-sm text-muted-foreground"
                          >
                            <div className="flex justify-between items-center ">
                              <span>
                                <b className="text-foreground w-[300px] text-ellipsis overflow-hidden whitespace-nowrap">
                                  {product.name}
                                </b>
                                <p className="text-xs">{`${quantity} X ${formatToIDR(
                                  product.price.toString()
                                )}`}</p>
                              </span>
                              <span>
                                {formatToIDR(String(quantity * product.price))}
                              </span>
                            </div>
                            <div className="flex justify-between items-center ">
                              <p>Shipping Cost</p>
                              <p>
                                {formatToIDR(
                                  String(
                                    shipping[product.id!]?.cost[0].value || 0
                                  )
                                )}
                              </p>
                            </div>
                            <b>{shipping[product.id!]?.service}</b>
                            <p>
                              Estimation {shipping[product.id!]?.cost[0].etd}
                            </p>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-2" />
                    </div>
                    <div>
                      <b className="text-sm">Shipping Address</b>
                      <p className=" w-[300px] text-sm text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">{`${address?.address}, ${address?.city.cityName}, ${address?.city.province}`}</p>
                    </div>
                  </div>
                  <div className="bg-white sticky bottom-0 ">
                    <div className=" w-full grid grid-cols-2 bg-gradient-to-tr from-white to-primary/20 py-4 px-2">
                      <div>
                        <p>Total</p>
                        <b className="text-sm">
                          {formatToIDR((+totalPrice + shippingFee).toString())}
                        </b>
                      </div>
                      <Button
                        onClick={handleCreatePayment}
                        className="lg:px-10 lg:py-6 font-bold"
                      >
                        {createPayment.isPending ? (
                          <span className="animate-pulse">
                            setting up your url
                          </span>
                        ) : (
                          <>
                            <ShieldCheck className="mr-2" />
                            Pay
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
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
