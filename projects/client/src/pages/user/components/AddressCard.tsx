import React from "react"
import { Button } from "@/components/ui/button"

type AddressType = {
  id: number
  userId: number
  cityId: number
  provinceId: number
  addressDetail: string
  isPrimary: boolean
}

const AddressCard = ({ address, i }: { address: AddressType; i: number }) => {
  return (
    <div
      key={address.id}
      className="w-full bg-zinc-50 rounded-md border shadow-sm overflow-hidden p-2 px-6 capitalize"
    >
      <span className="flex items-end gap-2 my-2">
        <h3 className="text-2xl font-bold">Address {i + 1}</h3>
        <p
          className={`${
            !address.isPrimary && "hidden"
          } text-primary px-2 py-1 rounded-lg bg-red-50 text-sm`}
        >
          primary
        </p>
      </span>
      <AddressDetail label="province" name="jakarta" />
      <AddressDetail label="city" name="jakarta barat" />
      <AddressDetail label="address" name="daan mogot" />
      <span className="flex justify-end">
        <Button variant="ghost">edit</Button>
        <div className={`${address.isPrimary && "hidden"}`}>
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
      <p className="text-lg">{label}:</p>
      <p className="text-md">{name}</p>
    </span>
  )
}

export default AddressCard
