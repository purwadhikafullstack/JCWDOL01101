import React, { useEffect, useRef, useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCity } from "@/hooks/useAddress";
import useOutsideClick from "@/hooks/useClickOutside";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";

const CityField = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const form = useFormContext();
  const cityName = form.getValues("cityName");
  const [search, setSearch] = useState(cityName || "");
  const [debounceSearch] = useDebounce(search, 500);
  const { data: cities, isLoading: citiesLoading } = useCity(debounceSearch);
  useEffect(() => {
    if (cityName) {
      setSearch(cityName);
    }
  }, [cityName]);

  useOutsideClick(ref, () => {
    setShow(false);
  });
  return (
    <FormField
      control={form.control}
      name="cityName"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="city" className="font-bold">
            {t("checkoutPage.addressModal.add.city")}
          </FormLabel>
          <FormControl>
            <div ref={ref}>
              <div className="flex gap-2 items-center relative">
                <Input
                  autoComplete="off"
                  id="city"
                  {...field}
                  value={search}
                  onChange={(e) => {
                    setShow(true);
                    setSearch(e.target.value);
                  }}
                />
                {show && cities && (
                  <div className=" mt-2 w-full absolute top-full left-0 z-10">
                    <div className="cursor-pointer w-full bg-background border overflow-auto transition-all duration-200 max-h-[150px] flex flex-col  items-start rounded-md text-sm">
                      {citiesLoading ? (
                        <div className="text-center">
                          <Loader2 className="animate-spin " />
                        </div>
                      ) : (
                        <>
                          {cities.length > 0 ? (
                            <>
                              {cities.map((city) => (
                                <div
                                  onClick={() => {
                                    setSearch(city.cityName);
                                    setShow(false);
                                    form.setValue("cityId", city.cityId);
                                    form.setValue("cityName", city.cityName);
                                  }}
                                  key={city.cityId}
                                  className="w-full p-2 rounded-md hover:bg-muted"
                                >
                                  {city.cityName}
                                </div>
                              ))}
                            </>
                          ) : (
                            <p className="text-center p-2 mx-auto">
                              {t("checkoutPage.addressModal.add.noCity")}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CityField;
