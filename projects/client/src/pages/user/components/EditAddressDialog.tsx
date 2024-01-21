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
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import LabelField from "@/components/input/LabelField"
import CityField from "@/components/input/CityField"
import RecepientField from "@/components/input/RecepientField"
import AddressField from "@/components/input/AddressField"
import NotesField from "@/components/input/NotesField"
import MainCheckboxField from "@/components/input/MainCheckboxField"
import PhoneField from "@/components/input/PhoneField"
import toast from "react-hot-toast"
import { Address } from "@/hooks/useAddress"
import { usePutAddress } from "@/hooks/useAddressMutation"
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

function EditAddressDialog({ address }: { address: Address }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const addressMutation = usePutAddress(Number(address.id))
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (address) {
      form.setValue("recepient", address.recepient)
      form.setValue("phone", address.phone)
      form.setValue("formatPhone", address.phone)
      form.setValue("label", address.label)
      form.setValue("cityId", address.cityId)
      form.setValue("cityName", address.city.cityName)
      form.setValue("address", address.address)
      form.setValue("notes", address.notes)
      form.setValue("isMain", address.isMain)
    }
  }, [address, form])

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    addressMutation.mutate({ userId: Number(address.userId), ...values })
  }

  useEffect(() => {
    if (addressMutation.isSuccess) {
      form.reset(emptyValues)
      toast.success("Successfully update address data")
      setOpen(false)
    }
  }, [addressMutation.isSuccess])

  return (
    <Dialog open={addressMutation.isPending || open} onOpenChange={setOpen}>
      <DialogTrigger>
        {t("checkoutPage.addressModal.modify.header")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("checkoutPage.addressModal.modify.header")}
          </DialogTitle>
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
            <div className="flex w-full justify-center">
              <Button
                disabled={addressMutation.isPending}
                type="submit"
                className="w-[60%] text-lg font-bold lg:py-6 mt-4"
              >
                {addressMutation.isPending && (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                )}
                {t("checkoutPage.addressModal.modify.modifyBtn")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditAddressDialog
