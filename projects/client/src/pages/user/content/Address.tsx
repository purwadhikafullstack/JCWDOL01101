import { buttonVariants } from "@/components/ui/button"
import React, { useContext } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

import AddressCard from "../components/AddressCard"
import NewAddressDialog from "../components/NewAddressDialog"
import UserContext from "@/context/UserContext"
import { useAddressByUserId } from "@/hooks/useAddress"

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
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider")
  }
  const { user } = userContext
  const {
    data: addresses,
    isFetched,
    isLoading,
  } = useAddressByUserId(Number(user?.id))

  return (
    <>
      <div className="flex flex-col p-2 space-y-4">
        <Dialog>
          <DialogTrigger
            className={buttonVariants({
              variant: "default",
              className: "self-end",
            })}
          >
            <Plus className="w-4 h-4 mr-2" /> New Address
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Address</DialogTitle>
            </DialogHeader>
            <NewAddressDialog name={user?.firstname || ""} userId={user?.id!} />
          </DialogContent>
        </Dialog>
        {isFetched &&
          addresses?.map((address) => <AddressCard address={address} />)}
      </div>
    </>
  )
}

export default Address
