import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Address } from "@/hooks/useAddress";
import { useTranslation } from "react-i18next";
import SelectAddressDialog from "@/components/SelectAddressDialog";

const ActiveAddress = ({
  activeAddress,
}: {
  activeAddress: Address | undefined;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col w-full">
      <p className="font-bold text-sm mb-2">{t("checkoutPage.shipping")}</p>
      {activeAddress ? (
        <>
          <div className="flex text-sm gap-2 items-center">
            <b>{activeAddress.recepient}</b>
            <span>({activeAddress.label})</span>
            {activeAddress.isMain && (
              <Badge className="rounded-[1rem]">{t("checkoutPage.main")}</Badge>
            )}
          </div>
          <div className="flex flex-col text-sm text-muted-foreground">
            <span>{activeAddress.phone}</span>
            <span>{activeAddress.address}</span>
            <span>
              {`${activeAddress.city.cityName}, ${activeAddress.city.province}`}
            </span>
          </div>
        </>
      ) : (
        <div className="w-full text-center">
          <img
            className="w-[150px] mx-auto"
            src="/ilus/directions.svg"
            alt="directions ilustration"
          />
          <p>Oops, you don't have an address? </p>
          <p className="text-sm text-muted-foreground">
            Don't worry, though—you can create one!
          </p>
        </div>
      )}
      <SelectAddressDialog>
        <Button variant="secondary" className="w-full lg:w-max mt-2">
          {activeAddress
            ? t("checkoutPage.addressBtn")
            : t("checkoutPage.emptyAddressBtn")}
        </Button>
      </SelectAddressDialog>
    </div>
  );
};

export default ActiveAddress;
