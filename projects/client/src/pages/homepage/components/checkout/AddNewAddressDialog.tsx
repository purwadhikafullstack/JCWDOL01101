import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useGetLocationOnGeo } from "@/hooks/useAddress";
import { usePostAddress } from "@/hooks/useAddressMutation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/custom-dialog";
import AddAddressForm from "./AddAddressForm";
import toast from "react-hot-toast";
import z from "zod";

export const addressSchema = z.object({
  recepient: z.string().min(4, "required").max(50),
  phone: z.string().min(9, "required").max(15),
  formatPhone: z.string().min(9, "required").max(15),
  label: z.string().min(3, "required").max(30),
  cityId: z.string().min(3, "required"),
  cityName: z.string().min(3, "required"),
  address: z.string().min(3, "required"),
  notes: z.string().optional(),
  isMain: z.boolean().default(false),
});

const emptyValues = {
  recepient: "",
  phone: "",
  label: "",
  cityId: "",
  address: "",
  notes: "",
  isMain: false,
};

export type Coordinates = {
  latitude: number;
  langitude: number;
};
const AddNewAddressDialog = ({
  userId,
  open,
  setAddDialog,
  handleToggleDialog,
}: {
  open: boolean;
  userId: number;
  name: string;
  setAddDialog: (value: boolean) => void;
  handleToggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
}) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const { data: currentLocation } = useGetLocationOnGeo(location);
  const addressMutation = usePostAddress();
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (currentLocation) {
      const loc = currentLocation.components;
      form.setValue("cityId", loc.city_code);
      form.setValue("cityName", loc.city);
    }
  }, [currentLocation]);

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    addressMutation.mutate({ userId, ...values });
  };

  useEffect(() => {
    if (addressMutation.isSuccess) {
      form.reset(emptyValues);
      handleToggleDialog(true);
    }
  }, [addressMutation.isSuccess]);

  const handleGetGeolocation = () => {
    if (currentLocation) {
      const loc = currentLocation.components;
      form.setValue("cityId", loc.city_code);
      form.setValue("cityName", loc.city);
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          langitude: pos.coords.longitude,
        });
      },
      (err) => {
        toast.error(
          "Location not detected. Please activate location via Settings on your device."
        );
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setAddDialog(value)}>
      <DialogContent className="sm:max-w-[712px]">
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
          <DialogTitle className="text-center text-3xl">
            Add Address
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="w-full max-h-[500px] overflow-y-auto pb-10 p-4">
          <h3 className="font-bold text-lg mb-10">
            Complete the detailed address
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <AddAddressForm
                isPending={addressMutation.isPending}
                location={location}
                handleGetGeolocation={handleGetGeolocation}
              />
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAddressDialog;
