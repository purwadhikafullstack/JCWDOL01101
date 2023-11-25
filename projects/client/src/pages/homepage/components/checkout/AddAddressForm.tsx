import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import LabelField from "./input/LabelField";
import CityField from "./input/CityField";
import RecepientField from "./input/RecepientField";
import AddressField from "./input/AddressField";
import NotesField from "./input/NotesField";
import MainCheckboxField from "./input/MainCheckboxField";
import PhoneField from "./input/PhoneField";
export type Coordinates = {
  latitude: number;
  langitude: number;
};

type AddAddressForm = {
  isPending: boolean;
  location: Coordinates | null;
  handleGetGeolocation: () => void;
};
const AddAddressForm = ({
  isPending,
  location,
  handleGetGeolocation,
}: AddAddressForm) => {
  const [tos, setTos] = useState(false);

  return (
    <>
      <RecepientField />
      <PhoneField />
      <LabelField />
      <CityField
        location={location}
        handleGetGeolocation={handleGetGeolocation}
      />
      <AddressField />
      <NotesField />
      <MainCheckboxField />
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
          className="w-[60%] text-lg font-bold lg:py-6 mt-4"
        >
          {isPending && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Submit
        </Button>
      </div>
    </>
  );
};

export default AddAddressForm;
