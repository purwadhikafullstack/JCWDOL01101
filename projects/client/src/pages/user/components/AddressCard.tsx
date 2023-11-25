import React from "react"
import { Button } from "@/components/ui/button"
import { Address } from "@/hooks/useAddress"

const AddressCard = ({ address }: { address: Address }) => {
  return (
    <div
      key={address.id}
      className="w-full bg-zinc-50 rounded-md border shadow-sm overflow-hidden p-2 px-6 capitalize"
    >
      <div className="py-1 mt-2">
        <span className="flex items-end gap-2 ">
          <h3 className="text-2xl font-bold text-red-500">{address.label}</h3>
          {address.isMain && (
            <p className="text-white rounded-md bg-red-500 text-sm px-2 py-1 font-semibold">
              primary
            </p>
          )}
        </span>
        <p className="text-lg font-bold mt-1">{address.recepient}</p>
        <p className="text-sm">{address.phone}</p>
      </div>
      <AddressDetail label="province" name="jakarta" />
      <AddressDetail label="city" name="jakarta barat" />
      <AddressDetail label="address" name="daan mogot" />
      <span className="flex justify-end">
        <Button variant="ghost">edit</Button>
        <div className={`${address.isMain && "hidden"}`}>
          <Button variant="ghost" className="text-red-300">
            delete
          </Button>
        </div>
      </span>
    </div>
  )
}

const AddressDetail = ({ label, name }: { label: string; name: string }) => {
  return (
    <span className="flex items-end gap-2">
      <p className="text-md">{name}</p>
    </span>
  )
}

export default AddressCard
