import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import CityField from "@/components/input/CityField";
import { Coordinates } from "./AddAddressForm";
import LabelField from "@/components/input/LabelField";
import AddressField from "@/components/input/AddressField";
import MainCheckboxField from "@/components/input/MainCheckboxField";
import NotesField from "@/components/input/NotesField";
import PhoneField from "@/components/input/PhoneField";
import RecepientField from "@/components/input/RecepientField";
import EditCityField from "@/components/input/EditCityField";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
          {t("checkoutPage.addressModal.modify.modifyBtn")}
        </Button>
      </div>
    </>
  );
};

export default EditForm;
