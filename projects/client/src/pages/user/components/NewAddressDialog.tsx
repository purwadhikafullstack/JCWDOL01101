import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Plus } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form } from "@/components/ui/form"
import LabelField from "@/components/input/LabelField"
import CityField from "@/components/input/CityField"
import RecepientField from "@/components/input/RecepientField"
import AddressField from "@/components/input/AddressField"
import NotesField from "@/components/input/NotesField"
import MainCheckboxField from "@/components/input/MainCheckboxField"
import PhoneField from "@/components/input/PhoneField"
import toast from "react-hot-toast"
import { usePostAddress } from "@/hooks/useAddressMutation"
import { addressSchema } from "@/pages/homepage/components/checkout/AddNewAddressDialog"
import { useTranslation } from "react-i18next"
const emptyValues = {
  recepient: "",
  phone: "",
  label: "",
  cityId: "",
  address: "",
  notes: "",
  isMain: false,
}
export type Coordinates = {
  latitude: number
  langitude: number
}

const NewAddressDialog = ({
  name,
  userId,
}: {
  userId: number
  name: string
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [tos, setTos] = useState(false)
  const addressMutation = usePostAddress()
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (name) {
      form.setValue("recepient", name)
    }
  }, [name, form])

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    addressMutation.mutate({ userId, ...values })
  }

  useEffect(() => {
    if (addressMutation.isSuccess) {
      form.reset(emptyValues)
      toast.success("Successfully create a new address")
      setOpen(false)
    }
  }, [addressMutation.isSuccess])

  return (
    <Dialog open={addressMutation.isPending || open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: "default",
          className: "self-end",
        })}
      >
        <Plus className="w-4 h-4 mr-2" />{" "}
        {t("checkoutPage.addressModal.add.header")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("checkoutPage.addressModal.add.header")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <RecepientField />
            <div className="grid grid-cols-2 gap-2">
              <LabelField />
              <PhoneField />
            </div>
            <CityField />
            <AddressField />
            <NotesField />
            <MainCheckboxField />
            <div className="flex items-center gap-2 text-xs">
              <Checkbox
                checked={tos}
                onCheckedChange={(state) => setTos(!!state)}
              />
              <label>
                <div className="flex flex-wrap gap-1">
                  {t("checkoutPage.addressModal.add.tos.tos1")}
                  <b>{t("checkoutPage.addressModal.add.tos.tos2")}</b>
                  {t("checkoutPage.addressModal.add.tos.tos3")}
                  <b>{t("checkoutPage.addressModal.add.tos.tos4")}</b>
                  {t("checkoutPage.addressModal.add.tos.tos5")}
                </div>
              </label>
            </div>
            <div className="flex w-full justify-center">
              <Button
                disabled={!tos && addressMutation.isPending}
                type="submit"
                className="w-[60%] text-lg font-bold lg:py-6 mt-4"
              >
                {addressMutation.isPending && (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                )}
                {t("checkoutPage.addressModal.add.submitBtn")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewAddressDialog
