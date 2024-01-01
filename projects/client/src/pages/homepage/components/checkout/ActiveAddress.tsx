import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Address } from "@/hooks/useAddress";
import React from "react";
import { useTranslation } from "react-i18next";

const ActiveAddress = ({
  activeAddress,
}: {
  activeAddress: Address | undefined;
}) => {
  const { t } = useTranslation();
  return (
    <>
      {activeAddress ? (
        <>
          <div className="py-2">
            <div className="flex text-sm gap-2 items-center">
              <b>{activeAddress.recepient}</b>
              <span>({activeAddress.label})</span>
              {activeAddress.isMain && (
                <Badge className="rounded-[1rem]">
                  {t("checkoutPage.main")}
                </Badge>
              )}
            </div>
            <div className="flex flex-col text-sm text-muted-foreground">
              <span>{activeAddress.phone}</span>
              <span>{activeAddress.address}</span>
              <span>
                {`${activeAddress.city.cityName}, ${activeAddress.city.province}`}
              </span>
            </div>
          </div>
          <Separator className="my-2" />
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
    </>
  );
};

export default ActiveAddress;
