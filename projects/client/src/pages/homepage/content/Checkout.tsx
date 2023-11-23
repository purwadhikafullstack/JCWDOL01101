import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserContext from "@/context/UserContext";
import { useCart } from "@/hooks/useCart";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { ArrowLeft, Check, Verified, X } from "lucide-react";
import React, { useContext, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const Checkout = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const { data: cart } = useCart(user?.id!);
  const cartProducts = useMemo(() => cart?.cart.cartProducts || [], [cart]);
  const totalPrice = cart?.totalPrice || 0;
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setSecondDialogOpen] = useState(false);

  const handleOpenFirstDialog = () => {
    setIsFirstDialogOpen(true);
  };
  return (
    <div className="flex w-full gap-8">
      <section className="flex-1">
        <h3 className="font-bold text-xl pt-4">Checkout</h3>
        <h4 className="font-bold my-2 mt-8">Shipping Address</h4>
        <Separator />
        <div className="py-2">
          <div className="flex text-sm gap-2 items-center">
            <b>Tetsu Tetsu Hero</b>
            <span>(Rumah)</span>
            <Badge variant="default" className="rounded-md">
              default
            </Badge>
          </div>
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>BTN Kepala 45 Blok. E26 Jl. Sakura</span>
            <span>Denpasar, Kab. Denpasar, 19003</span>
          </div>
        </div>
        <Separator className="my-2" />
        <div>
          <Dialog open={isFirstDialogOpen} onOpenChange={setIsFirstDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">Choose Other Address</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[712px] pb-20">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">
                  Select Shipment Address
                </DialogTitle>
              </DialogHeader>
              <div>
                <Input placeholder="Search your address" />
                <Button
                  onClick={() => {
                    setIsFirstDialogOpen(false);
                    setSecondDialogOpen(true);
                  }}
                  variant="outline"
                  className="w-full my-4 mb-6 text-primary border-primary hover:text-primary/80 font-bold"
                >
                  Add New Address
                </Button>
                <div className="space-y-4">
                  <ChekoutAddress pick={true} />
                  <ChekoutAddress />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <CustomDialog
            open={isSecondDialogOpen}
            onOpenChange={setSecondDialogOpen}
          >
            <AddNewAddressDialog
              handleOpenFirstDialog={handleOpenFirstDialog}
            />
          </CustomDialog>
        </div>
        <div className="border border-y-4 border-x-0 py-2 my-4 space-y-4">
          {cartProducts.map(({ product, id }) => (
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
                <span className="font-bold text-sm">Choose Duration</span>
                <Select>
                  <SelectTrigger
                    className={buttonVariants({
                      variant: "default",
                      className:
                        "rounded-lg lg:justify-between py-4 font-semibold",
                    })}
                  >
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
