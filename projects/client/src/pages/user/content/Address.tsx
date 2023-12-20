import { buttonVariants } from "@/components/ui/button"
import React, { useContext } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

import AddressCard from "../components/AddressCard"
import NewAddressDialog from "../components/NewAddressDialog"
import UserContext from "@/context/UserContext"
import { useAddressByUserId } from "@/hooks/useAddress"
import AddressModalSkeleton from "@/components/skeleton/AddressModalSkeleton"

const Address = () => {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider")
  }
  const { user } = userContext
  const { data: addresses, isLoading } = useAddressByUserId(Number(user?.id))

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
          <NewAddressDialog name={user?.firstname || ""} userId={user?.id!} />
        </Dialog>
        {!isLoading ? (
          <>
            {addresses && addresses?.length > 0 ? (
              <>
                {addresses?.map((address) => (
                  <AddressCard key={address.id} address={address} />
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
    </>
  )
}

export default Address
