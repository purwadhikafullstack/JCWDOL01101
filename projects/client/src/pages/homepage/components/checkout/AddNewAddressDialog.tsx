import React, { useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, X } from "lucide-react"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { usePostAddress } from "@/hooks/useAddressMutation"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/custom-dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import AddAddressForm from "./AddAddressForm"
import z from "zod"
import { useTranslation } from "react-i18next"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export const addressSchema = z.object({
  recepient: z.string().trim().min(4, "required").max(50),
  phone: z.string().min(9, "required").max(15),
  formatPhone: z.string().min(9, "required").max(15),
  label: z.string().trim().min(3, "required").max(15, "max label length is 15"),
  cityId: z.string().min(1, "required"),
  cityName: z.string().trim().min(3, "required"),
  address: z.string().trim().min(3, "required"),
  notes: z.string().trim().optional(),
  isMain: z.boolean().default(false),
})

const emptyValues = {
  recepient: "",
  phone: "",
  label: "",
  cityId: "",
  address: "",
  notes: "",
  isMain: false,
}

const AddNewAddressDialog = ({
  userId,
  open,
  setAddDialog,
  handleToggleDialog,
}: {
  open: boolean
  userId: number
  name: string
  setAddDialog: (value: boolean) => void
  handleToggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void
}) => {
  const { t } = useTranslation()
  const addressMutation = usePostAddress()
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyValues,
  })

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    addressMutation.mutate({ userId, ...values })
  }

  useEffect(() => {
    if (addressMutation.isSuccess) {
      form.reset(emptyValues)
      handleToggleDialog(true)
    }
  }, [addressMutation.isSuccess])
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog
        open={addressMutation.isPending || open}
        onOpenChange={(value) => setAddDialog(value)}
      >
        <DialogContent className="w-full lg:max-w-[712px]">
          <DialogClose
            disabled={addressMutation.isPending}
            onClick={() => {
              handleToggleDialog(true)
            }}
            className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </DialogClose>

          <DialogClose
            disabled={addressMutation.isPending}
            onClick={() => {
              handleToggleDialog(true)
            }}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-center lg:text-3xl">
              {t("checkoutPage.addressModal.add.header")}
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="w-full md:max-h-[500px] overflow-y-auto pb-10 p-4">
            <h3 className="font-bold text-lg mb-10">
              {t("checkoutPage.addressModal.add.desc")}
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <AddAddressForm isPending={addressMutation.isPending} />
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer
      open={addressMutation.isPending || open}
      onOpenChange={(value) => setAddDialog(value)}
    >
      <DrawerContent className="h-[85%]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("checkoutPage.addressModal.add.header")}</DrawerTitle>
        </DrawerHeader>
        <div className="w-full lg:max-h-[500px] overflow-y-auto pb-10 p-4">
          <h3 className="font-bold text-lg mb-10">
            {t("checkoutPage.addressModal.add.desc")}
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <AddAddressForm isPending={addressMutation.isPending} />
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default AddNewAddressDialog
