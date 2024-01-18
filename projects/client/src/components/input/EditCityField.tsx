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
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";

const EditCityField = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const form = useFormContext();
  const [search, setSearch] = useState(form.getValues("cityName"));
  const [debounceSearch] = useDebounce(search, 500);
  const { data: cities, isLoading: citiesLoading } = useCity(debounceSearch);

  React.useEffect(() => {
    if (form.getValues("cityName")) {
      setSearch(form.getValues("cityName"));
    }
  }, [form.getValues("cityName")]);

  useOutsideClick(ref, () => {
    setShow(false);
  });
  return (
    <FormField
      control={form.control}
      name="cityName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold" htmlFor="city">
            City
          </FormLabel>
          <FormControl>
            <div ref={ref}>
              <div className="flex gap-2 items-center">
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
              </div>
              {show && cities && (
                <div className="mt-2">
                  <div className="cursor-pointer w-full border overflow-auto transition-all duration-200 max-h-[150px] flex flex-col  items-start rounded-md text-sm">
                    {citiesLoading ? (
                      <div className="text-center">
                        <Loader2 className="animate-spin " />
                      </div>
                    ) : (
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

export default EditCityField;
