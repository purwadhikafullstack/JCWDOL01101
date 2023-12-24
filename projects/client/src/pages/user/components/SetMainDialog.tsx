import React, { useEffect, FormEvent, useState } from "react"
import {
  Dialog,
  DialogTrigger,
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
import { useTranslation } from "react-i18next"

function SetMainDialog({ addressId }: { addressId: number }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const setMainAddress = useSetMainAddress(addressId)
  const onSetMain = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMainAddress.mutate()
  }

  useEffect(() => {
    if (setMainAddress.isSuccess) {
      toast.success("Successfully update address data")
      setOpen(false)
    }
  }, [setMainAddress.isSuccess])
  return (
    <Dialog open={setMainAddress.isPending || open} onOpenChange={setOpen}>
      <DialogTrigger>
        {t("checkoutPage.addressModal.main.makeMainBtn")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("checkoutPage.addressModal.main.makeMainBtn")}
          </DialogTitle>
          <DialogDescription>
            {t("checkoutPage.addressModal.add.makeMain")}
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
              {t("checkoutPage.addressModal.modify.modifyBtn")}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t("checkoutPage.exitModal.leaveBtn")}
              </Button>
            </DialogClose>
          </span>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SetMainDialog
