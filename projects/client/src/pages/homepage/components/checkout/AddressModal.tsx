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
import React, { useState } from "react";
import ChekoutAddress from "./ChekoutAddress";
import { Search, X } from "lucide-react";
import { useAddress } from "@/hooks/useAddress";
import { useDebounce } from "use-debounce";

type AddressModalProps = {
  userId: number;
  mainDialog: boolean;
  activeAddress: boolean;
  setMainDialog: (x: boolean) => void;
  toggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
  setModifyAddressId: (address: number) => void;
  handleToggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
};

const AddressModal = ({
  addressProps,
}: {
  addressProps: AddressModalProps;
}) => {
  const {
    userId,
    mainDialog,
    setMainDialog,
    activeAddress,
    toggleDialog,
    setModifyAddressId,
    handleToggleDialog,
  } = addressProps;
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 1000);
  const { data: address, isLoading } = useAddress(debounceSearch);
  return (
    <Dialog open={mainDialog} onOpenChange={(value) => setMainDialog(value)}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          {activeAddress ? "Choose Other Address" : "Create New Address"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[712px] pb-10">
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
  );
};

export default AddressModal;
