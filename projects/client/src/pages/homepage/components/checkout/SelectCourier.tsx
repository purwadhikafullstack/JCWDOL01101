import React from "react";
import SelectCourierSkeleton from "@/components/skeleton/SelectCourierSkeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Address } from "@/hooks/useAddress";
import { useCourier } from "@/hooks/useCheckout";
import { formatToIDR } from "@/lib/utils";
import { useBoundStore } from "@/store/client/useStore";
import { useTranslation } from "react-i18next";

type Props = {
  origin: string;
  weightTotal: number;
  address: Address | undefined;
};

const SelectCourier = ({ origin, address, weightTotal }: Props) => {
  const { t } = useTranslation();
  const addShippingFee = useBoundStore((state) => state.addShippingFee);
  const setLoading = useBoundStore((state) => state.setLoading);
  const getTotalShippingFee = useBoundStore(
    (state) => state.getTotalShippingFee
  );
  const [courier, setCourier] = React.useState("jne");
  const [service, setService] = React.useState("0");
  const { data, isLoading } = useCourier({
    origin,
    courier,
    destination: address?.cityId!,
    weight: weightTotal,
  });

  const selectedService = data?.costs[Number(service)];

  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  React.useEffect(() => {
    if (selectedService && selectedService.cost.length > 0) {
      addShippingFee({ name: courier, ...selectedService });
      getTotalShippingFee();
    }
  }, [selectedService]);

  return (
    <div className="w-full">
      {isLoading ? (
        <SelectCourierSkeleton />
      ) : (
        <>
          <span className="font-bold text-sm">
            {t("checkoutPage.cartItem.courier")}
          </span>
          <Select value={courier} onValueChange={setCourier}>
            <SelectTrigger
              disabled={isLoading}
              className={buttonVariants({
                variant: "default",
                className: `rounded-lg lg:justify-between font-semibold ${
                  isLoading && "animate-pulse"
                }`,
              })}
            >
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="jne">JNE</SelectItem>
                <SelectItem value="pos">POS Indonesia</SelectItem>
                <SelectItem value="tiki">TIKI</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {data && data.costs.length > 0 && (
            <>
              <div className="mt-2 text-muted-foreground grid grid-cols-2 gap-2">
                <span className="text-sm">{data?.name}</span>
                <Select
                  value={service}
                  onValueChange={(value) => {
                    setService(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {data?.costs.map((cost, i) => (
                        <SelectItem key={cost.service} value={i.toString()}>
                          {cost.service}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="text-muted-foreground col-start-2 text-sm">
                  {selectedService ? (
                    <>
                      <span>{`${selectedService.service} (${formatToIDR(
                        selectedService.cost[0].value
                      )})`}</span>
                      <p>{selectedService.description}</p>
                      <p>
                        Estimated arrival:{" "}
                        {`${selectedService.cost[0].etd} ${
                          +selectedService.cost[0].etd > 0 ? "days" : "day"
                        }`}
                      </p>
                    </>
                  ) : (
                    <p>Please select other service</p>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SelectCourier;
