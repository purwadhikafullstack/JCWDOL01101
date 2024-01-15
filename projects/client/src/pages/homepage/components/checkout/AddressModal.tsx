import React, { useState } from "react";
import AddressModalSkeleton from "@/components/skeleton/AddressModalSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
} from "@/components/ui/custom-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ChekoutAddress from "./ChekoutAddress";
import { Search, X } from "lucide-react";
import { useAddress } from "@/hooks/useAddress";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type AddressModalProps = {
  userId: number;
  mainDialog: boolean;
  setMainDialog: (x: boolean) => void;
  toggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
  setModifyAddressId: (address: number) => void;
  handleToggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
};

const AddressModal = ({
  addressProps,
  children,
}: {
  addressProps: AddressModalProps;
  children: React.ReactNode;
}) => {
  const {
    userId,
    mainDialog,
    setMainDialog,
    toggleDialog,
    setModifyAddressId,
    handleToggleDialog,
  } = addressProps;
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog open={mainDialog} onOpenChange={(value) => setMainDialog(value)}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-full lg:max-w-[712px] pb-10">
          <DialogClose
            onClick={() => {
              handleToggleDialog(false);
            }}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {t("checkoutPage.addressModal.main.header")}
            </DialogTitle>
          </DialogHeader>
          <AddressContent
            userId={userId}
            toggleDialog={toggleDialog}
            setModifyAddressId={setModifyAddressId}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={mainDialog} onOpenChange={(value) => setMainDialog(value)}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85%]">
        <DrawerHeader>
          <DrawerTitle>
            {t("checkoutPage.addressModal.main.header")}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <AddressContent
            userId={userId}
            toggleDialog={toggleDialog}
            setModifyAddressId={setModifyAddressId}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

type AddressContentProps = {
  userId: number;
  toggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
  setModifyAddressId: (address: number) => void;
};

function AddressContent({
  toggleDialog,
  setModifyAddressId,
  userId,
}: AddressContentProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 1000);
  const { data: address, isLoading } = useAddress(debounceSearch);
  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 w-5 h-5 -translate-y-1/2" />
        <Input
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("checkoutPage.addressModal.main.searchPlaceholder")}
        />
      </div>
      <Button
        onClick={() => {
          toggleDialog(false, true);
        }}
        variant="outline"
        className="w-full my-4 mb-6 text-primary dark:text-foreground border-primary dark:border-border hover:text-primary/80 font-bold"
      >
        {t("checkoutPage.addressModal.main.addAddressBtn")}
      </Button>
      <div className="space-y-4 overflow-y-auto  max-h-[580px] ">
        {!isLoading ? (
          <>
            {address && address?.length > 0 ? (
              <>
                {address.map((add) => (
                  <ChekoutAddress
                    key={add.id}
                    add={add}
                    getId={setModifyAddressId}
                    userId={userId}
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
                <p>{t("checkoutPage.addressError.header")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("checkoutPage.addressError.sub")}
                </p>
              </div>
            )}
          </>
        ) : (
          <AddressModalSkeleton />
        )}
      </div>
    </div>
  );
}

export default AddressModal;
