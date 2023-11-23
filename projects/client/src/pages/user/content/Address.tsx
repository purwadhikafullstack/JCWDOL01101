import { buttonVariants } from "@/components/ui/button"
import React from "react"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

import AddressCard from "../components/AddressCard"

const maps = [
  {
    id: 1,
    userId: 1,
    cityId: 1,
    provinceId: 1,
    addressDetail: "Daan Mogot",
    isPrimary: true,
  },
  {
    id: 2,
    userId: 1,
    cityId: 1,
    provinceId: 1,
    addressDetail: "Daan Mogot",
    isPrimary: false,
  },
  {
    id: 3,
    userId: 1,
    cityId: 1,
    provinceId: 1,
    addressDetail: "Daan Mogot",
    isPrimary: false,
  },
]

const Address = () => {
  return (
    <>
      <div className="flex flex-col p-2 space-y-4">
        <Link
          to="/dashboard/product/create"
          className={buttonVariants({
            variant: "default",
            className: "self-end",
          })}
        >
          <Plus className="w-4 h-4 mr-2" /> New Address
        </Link>
        {maps.map((address, i) => (
          <AddressCard address={address} i={i} />
        ))}
      </div>
    </>
  )
}

export default Address
