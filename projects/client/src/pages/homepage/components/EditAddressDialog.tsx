import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/custom-dialog";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, LocateFixed, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { useAddressById, useGetLocationOnGeo } from "@/hooks/useAddress";
import { usePutAddress } from "@/hooks/useAddressMutation";
import { addressSchema } from "./AddNewAddressDialog";

const emptyValues = {
  recepient: "",
  phone: "",
  label: "",
  city: "",
  address: "",
  notes: "",
  isMain: false,
};

type Coordinates = {
  latitude: number;
  langitude: number;
};
const EditAddressDialog = ({
  userId,
  addressId,
  handleToggleDialog,
}: {
  addressId: number | null;
  userId: number;
  handleToggleDialog: (main?: boolean, add?: boolean, edit?: boolean) => void;
}) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const { data: currentLocation, isLoading } = useGetLocationOnGeo(location);
  const { data: currentAddress } = useAddressById(addressId!);
  const cityInputRef = useRef<HTMLDivElement | null>(null);
  const [showCurrentLocBtn, setShowCurrentLocBtn] = useState(false);
  const updateAddress = usePutAddress(addressId!);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (currentAddress) {
      form.setValue("recepient", currentAddress.recepient);
      form.setValue("phone", currentAddress.phone);
      form.setValue("formatPhone", currentAddress.phone);
      form.setValue("label", currentAddress.label);
      form.setValue("cityId", currentAddress.cityId);
      form.setValue("address", currentAddress.address);
      form.setValue("notes", currentAddress.notes);
      form.setValue("isMain", currentAddress.isMain);
    }
  }, [currentAddress]);

  useEffect(() => {
    if (currentLocation) {
      const loc = currentLocation.components;
      form.setValue(
        "cityId",
        `${loc.city_district}, Kota ${loc.city}, ${loc.state}`
      );
    }
  }, [currentLocation]);

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    updateAddress.mutate({ userId, ...values });
  };
  useEffect(() => {
    if (updateAddress.isSuccess) {
      form.reset(emptyValues);
      handleToggleDialog(true);
    }
  }, [updateAddress.isSuccess]);

  const formatPhoneNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    form.setValue("phone", numericValue);
    return numericValue;
  };

  const handleGetGeolocation = () => {
    if (currentLocation) {
      const loc = currentLocation.components;
      form.setValue("cityId", loc.city);
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

  useEffect(() => {
    const handleClickInput = (e: MouseEvent) => {
      if (
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target as Node)
      ) {
        setShowCurrentLocBtn(false);
      }
    };
    document.addEventListener("mousedown", handleClickInput);

    return () => {
      document.removeEventListener("mousedown", handleClickInput);
    };
  }, [cityInputRef]);
  return (
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
          Modify Your Address
        </DialogTitle>
      </DialogHeader>
      <Separator />
      <div className="w-full max-h-[500px] overflow-y-auto pb-10 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="recepient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recepeint's name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formatPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={form.watch("formatPhone") || ""}
                      onChange={(e) => {
                        const formattedPhoneNumber = formatPhoneNumber(
                          e.target.value
                        );
                        field.onChange(formattedPhoneNumber);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="cityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City & District</FormLabel>
                    <FormControl>
                      <div ref={cityInputRef}>
                        <Input
                          onClick={() => setShowCurrentLocBtn(true)}
                          {...field}
                        />
                        {showCurrentLocBtn && (
                          <div
                            onClick={handleGetGeolocation}
                            className="cursor-pointer w-ful border flex gap-2 items-center p-2 py-4 rounded-md mt-1"
                          >
                            {isLoading ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <LocateFixed />
                            )}
                            Use Current Location
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes for courier (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    House colors, standards, special messages, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isMain"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span>Make it main address</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-center">
              <Button
                type="submit"
                className="w-[60%] text-lg font-bold lg:py-6"
              >
                {updateAddress.isPending && (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                )}
                Modify
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default EditAddressDialog;
