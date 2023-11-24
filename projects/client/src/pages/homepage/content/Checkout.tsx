import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserContext from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { Search, Verified } from "lucide-react";
import React, { useContext, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Dialog as CustomDialog } from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import ChekoutAddress from "../components/ChekoutAddress";
import AddNewAddressDialog from "../components/AddNewAddressDialog";
import { useActiveAddress, useAddress } from "@/hooks/useAddress";
import EditAddressDialog from "../components/EditAddressDialog";
import SelectCourier from "../components/SelectCourier";
import AddressModalSkeleton from "@/components/skeleton/AddressModalSkeleton";
import { useDebounce } from "use-debounce";

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
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 1000);

  const { data: cart } = useCart(user?.id!, !!user?.userCart);
  const { data: activeAddress } = useActiveAddress();
  const { data: address, isLoading } = useAddress(debounceSearch);

  const cartProducts = useMemo(() => cart?.cart.cartProducts || [], [cart]);
  const totalPrice = cart?.totalPrice || 0;
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
    <div className="flex w-full gap-8">
      <section className="flex-1">
        <h3 className="font-bold text-xl pt-4">Checkout</h3>
        <h4 className="font-bold my-2 mt-8">Shipping Address</h4>
        <Separator />
        {activeAddress ? (
          <>
            <div className="py-2">
              <div className="flex text-sm gap-2 items-center">
                <b>{activeAddress?.recepient}</b>
                <span>({activeAddress?.label})</span>
                <Badge variant="default" className="rounded-md">
                  default
                </Badge>
              </div>
              <div className="flex flex-col text-sm text-muted-foreground">
                <span>{activeAddress?.address}</span>
                <span>
                  {`${activeAddress?.city.cityName}, ${activeAddress.city.province}`}
                </span>
              </div>
            </div>
            <Separator className="my-2" />
          </>
        ) : (
          <div className="w-full text-center">
            <img
              className="w-[150px] mx-auto"
              src="/ilus/directions.svg"
              alt="directions ilustration"
            />
            <p>Oops, you don't have an address? </p>
            <p className="text-sm text-muted-foreground">
              Don't worry, though—you can create one!
            </p>
          </div>
        )}
        <div>
          <Dialog
            open={mainDialog}
            onOpenChange={(value) => setMainDialog(value)}
          >
            <DialogTrigger asChild>
              <Button variant="secondary">
                {activeAddress ? "Choose Other Address" : "Create New Address"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[712px] pb-10">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  Select Shipment Address
                </DialogTitle>
              </DialogHeader>
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2" />
                  <Input
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search recepient / city / label"
                  />
                </div>
                <Button
                  onClick={() => {
                    toggleDialog(false, true);
                  }}
                  variant="outline"
                  className="w-full my-4 mb-6 text-primary border-primary hover:text-primary/80 font-bold"
                >
                  Add New Address
                </Button>
                <div className="space-y-4 overflow-y-auto max-h-[580px] ">
                  {!isLoading ? (
                    <>
                      {address && address?.length > 0 ? (
                        <>
                          {address.map((add) => (
                            <ChekoutAddress
                              key={add.id}
                              add={add}
                              getId={setModifyAddressId}
                              userId={user?.id!}
                              handleToggleDialog={toggleDialog}
                            />
                          ))}
                        </>
                      ) : (
                        <div className="text-center">
                          <img
                            className="w-[150px] mx-auto"
                            src="/ilus/directions.svg"
                            alt="directions ilustration"
                          />
                          <p>Oops, you don't have an address? </p>
                          <p className="text-sm text-muted-foreground">
                            Don't worry, though—you can create one!
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <AddressModalSkeleton />
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <CustomDialog
            open={addDialog}
            onOpenChange={(value) => setAddDialog(value)}
          >
            <AddNewAddressDialog
              name={user?.firstname || ""}
              userId={user?.id!}
              handleToggleDialog={toggleDialog}
            />
          </CustomDialog>
          <CustomDialog
            open={editDialog}
            onOpenChange={(value) => setEditDialog(value)}
          >
            <EditAddressDialog
              userId={user?.id!}
              addressId={modifyAddressId}
              handleToggleDialog={toggleDialog}
            />
          </CustomDialog>
        </div>
        <div className="border border-y-4 border-x-0 py-2 my-4 space-y-4">
          {cartProducts.map(({ product, id, quantity }) => (
            <div key={id} className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex flex-col">
                  <span className="flex items-center">
                    <Verified className="text-primary h-4 w-4 mr-2" />
                    <b className="">Toten Official</b>
                  </span>
                  <span className="text-xs text-muted-foreground ml-6">
                    Kab. Tokyo
                  </span>
                  <div className="flex gap-2 items-start text-sm mt-2">
                    <img
                      src={`${baseURL}/${product.image}`}
                      className="w-[80px] h-[80px] object-contain"
                    />
                    <div className="flex flex-col gap-2">
                      <span>{product.name}</span>
                      <span className="font-bold">
                        {formatToIDR(product.price.toString())}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
              <div className="flex flex-col gap-2 px-4">
                <SelectCourier
                  quantity={quantity}
                  product={product}
                  address={activeAddress}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="w-[420px] relative ">
        <div className="w-ful sticky top-[100px]">
          <div className="w-full h-full px-4 py-6 mt-[100px] border rounded-lg space-y-3">
            <b className="font-bold">Shipping Summary</b>
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
              <b>{formatToIDR(totalPrice.toString())}</b>
            </div>
            <Separator />
            <div className="flex gap-2 justify-between items-center">
              <b>Shipping total</b>
              <span className="font-bold text-lg">-</span>
            </div>
            <Button className="font-bold w-full py-6 text-lg rounded-lg">
              Choose Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
