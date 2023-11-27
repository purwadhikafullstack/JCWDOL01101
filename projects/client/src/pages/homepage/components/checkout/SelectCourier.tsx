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
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { useBoundStore } from "@/store/client/useStore";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
type Service = {
  service: string;
  description: string;
  cost: {
    value: number;
    etd: string;
    note: string;
  }[];
};

const SelectCourier = ({
  product,
  address,
  quantity,
}: {
  product: Product;
  quantity: number;
  address: Address | undefined;
}) => {
  const addShippingFee = useBoundStore((state) => state.addShippingFee);
  const setLoading = useBoundStore((state) => state.setLoading);
  const getTotalShippingFee = useBoundStore(
    (state) => state.getTotalShippingFee
  );
  const [courier, setCourier] = useState("jne");
  const [service, setService] = useState("0");
  const { data, isLoading } = useCourier({
    courier,
    origin: "501",
    destination: address?.cityId!,
    weight: product.weight * quantity,
  });
  const selectedService: Service = data
    ? data?.costs[Number(service)]
    : { service: "", description: "", cost: [] };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (selectedService.cost.length > 0) {
      addShippingFee(product.id!, selectedService);
      getTotalShippingFee();
    }
  }, [selectedService]);

  return (
    <div className="w-full">
      <span className="font-bold text-sm">Choose Courier</span>
      <Select value={courier} onValueChange={setCourier}>
        <SelectTrigger
          disabled={isLoading}
          className={buttonVariants({
            variant: "default",
            className: `rounded-lg lg:justify-between py-6 font-semibold ${
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
      {data && (
        <>
          <div className="mt-2 text-muted-foreground grid grid-cols-2 gap-2">
            <span>{data?.name}</span>
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
            {isLoading ? (
              <Loader2 className="col-span-2 animate-spin w-4 h-4" />
            ) : (
              <div className="text-muted-foreground col-start-2 text-sm">
                {selectedService && (
                  <>
                    <span>{`${selectedService?.service} (${formatToIDR(
                      selectedService?.cost[0].value.toString()
                    )})`}</span>
                    <p>{selectedService?.description}</p>
                    <p>
                      Estimated arrival {}
                      {`${selectedService?.cost[0].etd} ${
                        +selectedService?.cost[0].etd > 0 ? "days" : "day"
                      }`}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SelectCourier;
