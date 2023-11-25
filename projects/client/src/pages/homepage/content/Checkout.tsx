import React, { useContext, useMemo, useState } from "react";
import UserContext from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import { formatToIDR } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useActiveAddress } from "@/hooks/useAddress";
import { Separator } from "@/components/ui/separator";
import AddressModal from "../components/checkout/AddressModal";
import CheckoutItem from "../components/checkout/CheckoutItem";
import ActiveAddress from "../components/checkout/ActiveAddress";
import BackToCartDialog from "../components/checkout/BackToCartDialog";
import AddNewAddressDialog from "../components/checkout/AddNewAddressDialog";
import { useBoundStore } from "@/store/client/useStore";
import EditAddressDialog from "../components/checkout/EditAddressDialog";

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
  const { data: activeAddress } = useActiveAddress();

  const cartProducts = useMemo(() => cart?.cart.cartProducts || [], [cart]);
  const totalPrice = cart?.totalPrice || 0;
  const shippingFee = useBoundStore((state) => state.totalShipping);
  const shippingTotal = shippingFee + Number(totalPrice);
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
                  activeAddress={activeAddress}
                />
              ))}
            </>
          </section>
          <div className="w-[420px] relative ">
            <div className="w-ful sticky top-[100px]">
              <div className="w-full h-full px-4 py-6 mt-[100px] border rounded-lg space-y-3">
                <b className="font-bold">Shipping Summary</b>
                <div>
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
                <Button className="font-bold w-full py-6 text-lg rounded-lg">
                  Choose Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
