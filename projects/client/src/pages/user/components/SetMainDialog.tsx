import React, { useEffect, FormEvent } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useSetMainAddress } from "@/hooks/useAddressMutation"
import toast from "react-hot-toast"

function SetMainDialog({ addressId }: { addressId: number }) {
  const setMainAddress = useSetMainAddress(addressId)
  const onSetMain = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMainAddress.mutate()
  }

  useEffect(() => {
    if (setMainAddress.isSuccess) {
      toast.success("Successfully update address data")
    }
  }, [setMainAddress.isSuccess])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Change Main Address</DialogTitle>
        <DialogDescription>
          You're about to change main address
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
                setMainAddress.isPending
                  ? "animate-spin w-4 h-4 mr-2"
                  : "hidden"
              }
            />
            Yes, change main address
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

export default SetMainDialog
