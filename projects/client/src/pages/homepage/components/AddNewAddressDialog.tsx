import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/custom-dialog";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LocateFixed, X } from "lucide-react";
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
import { useGetLocationOnGeo } from "@/hooks/useAddress";
const addressSchema = z.object({
  name: z.string().min(4, "required").max(50),
  phone: z.coerce.number().min(9, "required").max(15),
  formatPhone: z.string().min(9, "required").max(15),
  label: z.string().min(3, "required").max(30),
  city: z.string().min(3, "required"),
  address: z.string().min(3, "required"),
  notes: z.string().optional(),
  primary: z.boolean().default(false).optional(),
});

type Coordinates = {
  latitude: number;
  langitude: number;
};
const AddNewAddressDialog = ({
  handleOpenFirstDialog,
}: {
  handleOpenFirstDialog: () => void;
}) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [tos, setTos] = useState(false);
  const { data: currentLocation, isLoading } = useGetLocationOnGeo(location);
  const cityInputRef = useRef<HTMLDivElement | null>(null);
  const [showCurrentLocBtn, setShowCurrentLocBtn] = useState(false);
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      phone: 0,
      label: "",
      city: "",
      address: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (currentLocation) {
      const loc = currentLocation.components;
      form.setValue(
        "city",
        `${loc.city_district}, Kota ${loc.city}, ${loc.state}`
      );
    }
  }, [currentLocation]);

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    console.log(values);
  };

  const formatPhoneNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    form.setValue("phone", +numericValue);
    return numericValue;
  };

  const handleGetGeolocation = () => {
    if (currentLocation) {
      const loc = currentLocation.components;
      form.setValue(
        "city",
        `${loc.city_district}, Kota ${loc.city}, ${loc.state}`
      );
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
        onClick={handleOpenFirstDialog}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
      <DialogHeader>
        <DialogTitle className="text-center text-3xl">Add Address</DialogTitle>
      </DialogHeader>
      <Separator />
      <div className="w-full max-h-[500px] overflow-y-auto pb-10 p-4">
        <h3 className="font-bold text-lg mb-10">
          Complete the detailed address
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
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
                name="city"
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
              name="primary"
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
            <div className="flex items-center gap-2 text-xs">
              <Checkbox
                checked={tos}
                onCheckedChange={(state) => setTos(!!state)}
              />
              <label>
                I agree to the <b>Terms & Conditions</b> and{" "}
                <b>Privacy Policy</b>
                address settings in Toten.
              </label>
            </div>
            <div className="flex w-full justify-center">
              <Button
                disabled={!tos}
                type="submit"
                className="w-[60%] text-lg font-bold lg:py-6"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default AddNewAddressDialog;
