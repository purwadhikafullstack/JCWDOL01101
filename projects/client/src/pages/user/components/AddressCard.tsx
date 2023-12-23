import React from "react";
import { Address } from "@/hooks/useAddress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SetMainDialog from "./SetMainDialog";
import DeleteAddressDialog from "./DeleteAddressDialog";
import EditAddressDialog from "./EditAddressDialog";
import { cn } from "@/lib/utils";

const AddressCard = ({ address }: { address: Address }) => {
  return (
    <div className="w-full bg-zinc-50 rounded-md border shadow-sm overflow-hidden py-4 px-6 capitalize">
      <div className="mb-1 -space-y-0.5">
        <span className="flex items-end gap-2 ">
          <h3 className="text-lg font-bold text-red-500">{address.label}</h3>
          {address.isMain && (
            <p className="text-white rounded-md bg-red-500 text-xs px-2 py-1 font-semibold">
              primary
            </p>
          )}
        </span>
        <p className="text-2xl font-bold">{address.recepient}</p>
        <p className="text-lg">{address.phone}</p>
      </div>
      <span className="flex items-end gap-2">
        <p className="capitalize text-md">
          {address.city.province}, {address.city.cityName}, {address.address},{" "}
          {address.city.postalCode}
        </p>
      </span>
      <span className="text-primary flex justify-between mt-4">
        <div className="flex">
          <Dialog>
            <DialogTrigger>
              <p className="mr-4">edit</p>
            </DialogTrigger>
            <EditAddressDialog address={address} />
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <p
                className={cn(
                  address.isMain && "hidden",
                  "block border-l pl-4"
                )}
              >
                Set main address
              </p>
            </DialogTrigger>
            <SetMainDialog addressId={Number(address.id)} />
          </Dialog>
        </div>
        <div className={cn(address.isMain && "hidden", "block")}>
          <Dialog>
            <DialogTrigger>
              <p>delete</p>
            </DialogTrigger>
            <DeleteAddressDialog addressId={Number(address.id)} />
          </Dialog>
        </div>
      </span>
    </div>
  );
};

export default AddressCard;
