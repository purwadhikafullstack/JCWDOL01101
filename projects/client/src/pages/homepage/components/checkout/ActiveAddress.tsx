import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Address } from "@/hooks/useAddress";
import React from "react";

const ActiveAddress = ({
  activeAddress,
}: {
  activeAddress: Address | undefined;
}) => {
  return (
    <>
      {activeAddress ? (
        <>
          <div className="py-2">
            <div className="flex text-sm gap-2 items-center">
              <b>{activeAddress?.recepient}</b>
              <span>({activeAddress?.label})</span>
              <Badge variant="default" className="rounded-md">
                default
              </Badge>
            </div>
            <div className="flex flex-col text-sm text-muted-foreground">
              <span>{activeAddress?.address}</span>
              <span>
                {`${activeAddress?.city.cityName}, ${activeAddress.city.province}`}
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
