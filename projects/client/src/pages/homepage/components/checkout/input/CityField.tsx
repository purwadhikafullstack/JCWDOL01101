import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCity, useGetLocationOnGeo } from "@/hooks/useAddress";
import useOutsideClick from "@/hooks/useClickOutside";
import { Loader2, MapPin } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
export type Coordinates = {
  latitude: number;
  langitude: number;
};

const CityField = ({
  location,
  handleGetGeolocation,
}: {
  location: Coordinates | null;
  handleGetGeolocation: () => void;
}) => {
  const { isLoading } = useGetLocationOnGeo(location);
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
            City
          </FormLabel>
          <FormControl>
            <div ref={ref}>
              <div className="flex gap-2 items-center">
                <div
                  className="p-2 border rounded-md hover:bg-muted cursor-pointer transition-all duration-100"
                  onClick={handleGetGeolocation}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <MapPin />
                  )}
                </div>
                <Input
                  id="city"
                  {...field}
                  value={search}
                  onChange={(e) => {
                    setShow(true);
                    setSearch(e.target.value);
                  }}
                />
              </div>
              {show && cities && (
                <div className="pl-12 mt-2">
                  <div className="cursor-pointer w-ful border overflow-auto transition-all duration-200 max-h-[150px] flex flex-col  items-start rounded-md text-sm">
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
                            no city found
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CityField;
