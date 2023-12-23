import React from "react"
import { Address } from "@/hooks/useAddress"
import SetMainDialog from "./SetMainDialog"
import DeleteAddressDialog from "./DeleteAddressDialog"
import EditAddressDialog from "./EditAddressDialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

const AddressCard = ({ address }: { address: Address }) => {
  const { t } = useTranslation()
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
      <span className="text-primary flex justify-between mt-4">
        <div className="flex">
          <EditAddressDialog address={address} />
          <p className={cn(address.isMain && "hidden", "mx-2")}>|</p>
          <div className={cn(address.isMain && "hidden")}>
            <SetMainDialog addressId={Number(address.id)} />
          </div>
        </div>
        <div className={cn(address.isMain && "hidden")}>
          <DeleteAddressDialog addressId={Number(address.id)} />
        </div>
      </span>
    </div>
  )
}

export default AddressCard
