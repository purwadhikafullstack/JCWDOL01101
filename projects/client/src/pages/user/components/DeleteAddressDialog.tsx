import React, { FormEvent, useEffect } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useDeleteAddress } from "@/hooks/useAddressMutation"
import toast from "react-hot-toast"

function DeleteAddressDialog({ addressId }: { addressId: number }) {
  const deleteAddress = useDeleteAddress(addressId)
  const onSetMain = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    deleteAddress.mutate()
  }

  useEffect(() => {
    if (deleteAddress.isSuccess) {
      toast.success("Successfully delete address")
    }
  }, [deleteAddress.isSuccess])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Address</DialogTitle>
        <DialogDescription>
          You're about to delete this address
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSetMain}>
        <span className="flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            className="cursor-pointer "
          >
            <Loader2
              className={
                deleteAddress.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
              }
            />
            Yes, delete address
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </span>
      </form>
    </DialogContent>
  )
}

export default DeleteAddressDialog
