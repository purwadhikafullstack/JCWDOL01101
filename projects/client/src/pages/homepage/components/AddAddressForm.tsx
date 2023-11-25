import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, LocateFixed } from "lucide-react";
import React, { MutableRefObject, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useGetLocationOnGeo } from "@/hooks/useAddress";
import { Coordinates } from "./AddNewAddressDialog";

type AddAddressForm = {
  isPending: boolean;
  showBtnLoc: boolean;
  location: Coordinates | null;
  cityInputRef: MutableRefObject<HTMLDivElement | null>;
  setShowCurrentLocBtn: (state: boolean) => void;
  handleGetGeolocation: () => void;
};
const AddAddressForm = ({
  isPending,
  location,
  showBtnLoc,
  cityInputRef,
  setShowCurrentLocBtn,
  handleGetGeolocation,
}: AddAddressForm) => {
  const { isLoading } = useGetLocationOnGeo(location);
  const [tos, setTos] = useState(false);
  const form = useFormContext();

  const formatPhoneNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    form.setValue("phone", numericValue);
    return numericValue;
  };
  return (
    <>
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
              <FormLabel>City</FormLabel>
              <FormControl>
                <div ref={cityInputRef}>
                  <Input
                    onClick={() => setShowCurrentLocBtn(true)}
                    {...field}
                  />
                  {showBtnLoc && (
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
      <div className="flex items-center gap-2 text-xs">
        <Checkbox checked={tos} onCheckedChange={(state) => setTos(!!state)} />
        <label>
          I agree to the <b>Terms & Conditions</b> and <b>Privacy Policy</b>
          address settings in Toten.
        </label>
      </div>
      <div className="flex w-full justify-center">
        <Button
          disabled={!tos}
          type="submit"
          className="w-[60%] text-lg font-bold lg:py-6"
        >
          {isPending && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Submit
        </Button>
      </div>
    </>
  );
};

export default AddAddressForm;
