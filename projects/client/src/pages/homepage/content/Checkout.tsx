import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import UserContext from "@/context/UserContext";
import { useActiveAddress } from "@/hooks/useAddress";
import { useCart } from "@/hooks/useCart";
import { formatToIDR } from "@/lib/utils";
import { useBoundStore } from "@/store/client/useStore";
import ActiveAddress from "../components/checkout/ActiveAddress";
import AddNewAddressDialog from "../components/checkout/AddNewAddressDialog";
import AddressModal from "../components/checkout/AddressModal";
import BackToCartDialog from "../components/checkout/BackToCartDialog";
import CheckoutItem from "../components/checkout/CheckoutItem";
import EditAddressDialog from "../components/checkout/EditAddressDialog";
import PaymentModal from "../components/checkout/PaymentModal";
import { useGetClosestWarehouse } from "@/hooks/useWarehouse";
import { useNavigate } from "react-router-dom";

export type Dialog = {
  main: boolean;
  add: boolean;
  edit: boolean;
};

const Checkout = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const { data: cart } = useCart(user?.id!, !!user?.userCart);

  const navigate = useNavigate();
  useEffect(() => {
    if (!cart) {
      return navigate("/");
    }
  }, [cart]);

  const { data: activeAddress } = useActiveAddress();
  const { data: closestWarehouse } = useGetClosestWarehouse({
    lat: activeAddress?.lat,
    lng: activeAddress?.lng,
  });

  const cartProducts = useMemo(() => cart?.cart.cartProducts || [], [cart]);
  const totalPrice = cart?.totalPrice || 0;
  const shippingFee = useBoundStore((state) => state.totalShipping);
  const shippingTotal = Number(shippingFee) + Number(totalPrice);
  const [mainDialog, setMainDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [modifyAddressId, setModifyAddressId] = useState<number | null>(null);
  const toggleDialog = (main = false, add = false, edit = false) => {
    setMainDialog(main);
    setAddDialog(add);
    setEditDialog(edit);
  };

  return (
    <>
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
        <div className="flex w-full gap-8">
          <section className="flex-1">
            <h3 className="font-bold text-xl pt-4">Checkout</h3>
            <h4 className="font-bold my-2 mt-8">Shipping Address</h4>
            <Separator />
            <ActiveAddress activeAddress={activeAddress} />
            <AddressModal
              addressProps={{
                userId: user?.id!,
                mainDialog,
                toggleDialog,
                setMainDialog,
                setModifyAddressId,
                activeAddress: !!activeAddress,
                handleToggleDialog: toggleDialog,
              }}
            />
            <AddNewAddressDialog
              open={addDialog}
              name={user?.firstname || ""}
              userId={user?.id!}
              setAddDialog={setAddDialog}
              handleToggleDialog={toggleDialog}
            />
            <EditAddressDialog
              open={editDialog}
              userId={user?.id!}
              addressId={modifyAddressId}
              setEditDialog={setEditDialog}
              handleToggleDialog={toggleDialog}
            />
            <>
              {cartProducts.map(({ product, id, quantity }, i) => (
                <CheckoutItem
                  key={id}
                  index={i}
                  length={cartProducts.length || 0}
                  product={product}
                  quantity={quantity}
                  warehouse={closestWarehouse}
                  activeAddress={activeAddress}
                />
              ))}
            </>
          </section>
          <div className="w-[420px] relative ">
            <div className="w-ful sticky top-[100px]">
              <div className="w-full h-full px-4 py-6 mt-[100px] border rounded-lg">
                <div className="space-y-3 mb-5">
                  <b className="font-bold">Shipping Summary</b>
                  <div className="text-sm">
                    <div className="flex gap-2 justify-between items-center">
                      <span className="flex gap-2 items-center">
                        Total Price{" "}
                        <p>
                          (
                          {`${cartProducts.length} ${
                            cartProducts.length > 1 ? "products" : "product"
                          }`}
                          )
                        </p>
                      </span>
                      <p>{formatToIDR(totalPrice.toString())}</p>
                    </div>
                    <div className="flex gap-2 justify-between items-center">
                      <span className="flex gap-2 items-center">
                        Total Shipping Fee
                      </span>
                      <p>{formatToIDR(shippingFee.toString())}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-2 justify-between items-center">
                    <b>Shipping total</b>
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
                    cartProducts={cartProducts}
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
