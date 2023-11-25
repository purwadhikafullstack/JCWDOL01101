import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import CityField from "./input/CityField";
import { Coordinates } from "./AddAddressForm";
import LabelField from "./input/LabelField";
import AddressField from "./input/AddressField";
import MainCheckboxField from "./input/MainCheckboxField";
import NotesField from "./input/NotesField";
import PhoneField from "./input/PhoneField";
import RecepientField from "./input/RecepientField";
import EditCityField from "./input/EditCityField";

type AddAddressForm = {
  isPending: boolean;
  location: Coordinates | null;
  handleGetGeolocation: () => void;
};
const EditForm = ({
  isPending,
  location,
  handleGetGeolocation,
}: AddAddressForm) => {
  return (
    <>
      <RecepientField />
      <PhoneField />
      <LabelField />
      <EditCityField
        location={location}
        handleGetGeolocation={handleGetGeolocation}
      />
      <AddressField />
      <NotesField />
      <MainCheckboxField />
      <div className="flex w-full justify-center">
        <Button type="submit" className="w-[60%] text-lg font-bold lg:py-6">
          {isPending && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Modify
        </Button>
      </div>
    </>
  );
};

export default EditForm;
