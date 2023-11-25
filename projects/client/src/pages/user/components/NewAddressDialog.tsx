import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, LocateFixed } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import CitySelectFormField from "./CitySelectFormField"
import ProvinceSelectFormField from "./ProvinceSelectFormField"
import toast from "react-hot-toast"
import { useCityByProvinceId, useGetLocationOnGeo } from "@/hooks/useAddress"
import { usePostAddress } from "@/hooks/useAddressMutation"
import AddressFormField from "./AddressFormField"
import PrimarySelectFormField from "./PrimarySelectFormField"
const addressSchema = z.object({
  recepient: z.string().min(4, "required").max(50),
  phone: z.string().min(9, "required").max(15),
  label: z.string().min(3, "required").max(30),
  provinceId: z.number().min(1, "required"),
  cityId: z.number().min(1, "required"),
  address: z.string().min(3, "required"),
  isPrimary: z.boolean().default(false),
})

const emptyValues = {
  recepient: "",
  phone: "",
  label: "",
  cityId: 0,
  provinceId: 0,
  address: "",
  isPrimary: false,
}

type Coordinates = {
  latitude: number
  langitude: number
}
const NewAddressDialog = ({
  name,
  userId,
}: {
  userId: number
  name: string
}) => {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const { data: currentLocation, isLoading } = useGetLocationOnGeo(location)
  const addressMutation = usePostAddress()
  const cityInputRef = useRef<HTMLDivElement | null>(null)
  const [showCurrentLocBtn, setShowCurrentLocBtn] = useState(false)
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (currentLocation) {
      const loc = currentLocation.components
      form.setValue(
        "address",
        `${loc.city_district}, Kota ${loc.city}, ${loc.state}`
      )
    }
  }, [currentLocation])

  useEffect(() => {
    if (userId) {
      form.setValue("recepient", name)
    }
  }, [name, form])

  const onSubmit = (values: z.infer<typeof addressSchema>) => {
    // addressMutation.mutate({ userId, ...values })
    console.log(values)
  }

  useEffect(() => {
    if (addressMutation.isSuccess) {
      form.reset(emptyValues)
    }
  }, [addressMutation.isSuccess])

  const handleGetGeolocation = () => {
    if (currentLocation) {
      const loc = currentLocation.components
      form.setValue(
        "address",
        `${loc.city_district}, Kota ${loc.city}, ${loc.state}`
      )
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          langitude: pos.coords.longitude,
        })
      },
      (err) => {
        toast.error(
          "Location not detected. Please activate location via Settings on your device."
        )
      }
    )
  }

  useEffect(() => {
    const handleClickInput = (e: MouseEvent) => {
      if (
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target as Node)
      ) {
        setShowCurrentLocBtn(false)
      }
    }
    document.addEventListener("mousedown", handleClickInput)

    return () => {
      document.removeEventListener("mousedown", handleClickInput)
    }
  }, [cityInputRef])

  const { data: cityByProvince, isFetched } = useCityByProvinceId(
    form.getValues("provinceId")
  )

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <AddressFormField name="recepient" label="Recepeint's name" />
          <div className="grid grid-cols-2 gap-4">
            <AddressFormField name="label" label="Label Address" />
            <AddressFormField name="phone" label="Phone Number" />
          </div>
          <div className="w-full grid grid-cols-2 gap-2">
            <ProvinceSelectFormField />
            {isFetched && <CitySelectFormField data={cityByProvince} />}
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Detail</FormLabel>
                <FormControl>
                  <div ref={cityInputRef}>
                    <Input
                      onClick={() => setShowCurrentLocBtn(true)}
                      {...field}
                    />
                    {showCurrentLocBtn && (
                      <div
                        onClick={handleGetGeolocation}
                        className="cursor-pointer w-ful border flex gap-2 items-center p-2 py-4 rounded-md mt-1"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <LocateFixed />
                        )}
                        Use Current Location
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PrimarySelectFormField
            name="isPrimary"
            label="Make it primary address"
          />
          <div className="flex w-full justify-center">
            <Button type="submit" className="w-[60%] text-lg font-bold lg:py-6">
              {addressMutation.isPending && (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              )}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default NewAddressDialog
