import React from "react";
import { Address } from "@/hooks/useAddress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SetMainDialog from "./SetMainDialog";
import DeleteAddressDialog from "./DeleteAddressDialog";
import EditAddressDialog from "./EditAddressDialog";
import { cn } from "@/lib/utils";
import { Badge } from "lucide-react";
import { useTranslation } from "react-i18next";

const AddressCard = ({ address }: { address: Address }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-inherit rounded-md border shadow-sm overflow-hidden py-4 px-6 capitalize">
      <div className="mb-1 space-y-0.5">
        <span className="flex items-end gap-2 ">
          <h3 className="text-lg font-bold text-red-500">{address.label}</h3>
          <Badge
            className={cn(
              !address.isMain && "hidden",
              "rounded-lg bg-red-500 text-xs p-1 text-white font-semibold"
            )}
          >
            {t("checkoutPage.addressModal.main.primaryBadge")}
          </Badge>
        </span>
        <p className="text-2xl font-bold">{address.recepient}</p>
        <p className="text-lg">{address.phone}</p>
      </div>
      <p className="items-end capitalize text-md">
        {`${address.city.province}, ${address.city.cityName}, ${address.address}, ${address.city.postalCode}`}
      </p>
      <div className="text-primary flex justify-between mt-4">
        <div className="flex">
          <EditAddressDialog address={address} />
          <SetMainDialog addressId={Number(address.id)} />
        </div>
        <div className={cn(address.isMain && "hidden", "block")}>
          <DeleteAddressDialog addressId={Number(address.id)} />
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
