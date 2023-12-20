import React, { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/custom-dialog";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useAddressById } from "@/hooks/useAddress";
import { usePutAddress } from "@/hooks/useAddressMutation";
import EditForm from "./EditForm";
import z from "zod";
import { useTranslation } from "react-i18next";

export const editAddressSchema = z.object({
  recepient: z.string().min(4, "required").max(50),
  phone: z.string().min(9, "required").max(15),
  formatPhone: z.string().min(9, "required").max(15),
  label: z.string().min(3, "required").max(30),
  cityId: z.string().min(1, "required"),
  cityName: z.string().min(1, "required"),
  address: z.string().min(3, "required"),
  notes: z.string().optional(),
  isMain: z.boolean().default(false),
});

const emptyValues = {
  recepient: "",
  phone: "",
  label: "",
  city: "",
  address: "",
  notes: "",
  isMain: false,
};

const EditAddressDialog = ({
  userId,
  open,
  addressId,
  setEditDialog,
  handleToggleDialog,
}: {
  open: boolean;
  addressId: number | null;
  userId: number;
  setEditDialog: (value: boolean) => void;
  handleToggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { data: currentAddress } = useAddressById(addressId!);
  const updateAddress = usePutAddress(addressId!);

  const form = useForm<z.infer<typeof editAddressSchema>>({
    resolver: zodResolver(editAddressSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (currentAddress) {
      form.setValue("recepient", currentAddress.recepient);
      form.setValue("phone", currentAddress.phone);
      form.setValue("formatPhone", currentAddress.phone);
      form.setValue("label", currentAddress.label);
      form.setValue("cityId", currentAddress.city.cityId);
      form.setValue("cityName", currentAddress.city.cityName);
      form.setValue("address", currentAddress.address);
      form.setValue("notes", currentAddress.notes);
      form.setValue("isMain", currentAddress.isMain);
    }
  }, [currentAddress]);

  const onSubmit = (values: z.infer<typeof editAddressSchema>) => {
    updateAddress.mutate({ userId, ...values });
  };
  useEffect(() => {
    if (updateAddress.isSuccess) {
      form.reset(emptyValues);
      handleToggleDialog(true);
    }
  }, [updateAddress.isSuccess]);

  return (
    <Dialog open={open} onOpenChange={(value) => setEditDialog(value)}>
      <DialogContent className="w-full lg:max-w-[712px]">
        <DialogClose
          onClick={() => {
            handleToggleDialog(true);
          }}
          className="absolute left-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </DialogClose>

        <DialogClose
          onClick={() => {
            handleToggleDialog(true);
          }}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-center lg:text-3xl">
            {t("checkoutPage.addressModal.modify.header")}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="w-full h-[500px] overflow-y-auto pb-10 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <EditForm isPending={updateAddress.isPending} />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAddressDialog;
