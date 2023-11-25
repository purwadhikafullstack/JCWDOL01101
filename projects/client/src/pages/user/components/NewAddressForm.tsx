import React, { useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"
import PrimarySelectFormField from "./PrimarySelectFormField"
import AddressFormField from "./AddressFormField"
import CitySelectFormField from "./CitySelectFormField"
import ProvinceSelectFormField from "./ProvinceSelectFormField"
import { useToast } from "@/components/ui/use-toast"
import { useCity, useCityByProvinceId } from "@/hooks/useAddress"
import UserContext from "@/context/UserContext"
import { usePostAddress } from "@/hooks/useAddressMutation"

export const AddressSchema = z.object({
  cityId: z.string().min(1, "Must select city"),
  provinceId: z.string().min(1, "Must select province"),
  addressDetail: z.string().min(1, "Address detail is empty"),
  isPrimary: z.string(),
})

let emptyValues = {
  cityId: "0",
  provinceId: "0",
  addressDetail: "",
  isPrimary: "false",
}

const NewAddressForm = () => {
  const { toast } = useToast()
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider")
  }
  const { user } = userContext
  // const { addressMutation } = usePostAddress(user?.id)

  // const form = useForm<z.infer<typeof AddressSchema>>({
  //   resolver: zodResolver(AddressSchema),
  //   defaultValues: emptyValues,
  // })
  // const onSubmit = (values: z.infer<typeof AddressSchema>) => {
  //   // addressMutation.mutate(values)
  //   console.log(values)
  // }

  // useEffect(() => {
  //   if (addressMutation.isSuccess) {
  //     toast({
  //       title: "Address Created",
  //       description: "Successfully create new address",
  //       duration: 3000,
  //     })
  //   }
  // }, [addressMutation.isSuccess, toast])

  // const { data: cityByProvince, isFetched } = useCityByProvinceId(
  //   Number(form.getValues("provinceId"))
  // )

  // console.log(Number(form.getValues("provinceId")))

  return (
    <div className="w-full">
      <span className="flex text-sm mb-8">
        <Link to="/user/address" className="text-muted-foreground">
          address /
        </Link>{" "}
        <p className="text-primary"> new-address</p>
      </span>
      {/* <div className="w-[768px] mx-auto">
        <h2 className="text-xl mb-10">New Address</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full grid grid-cols-2 gap-2">
              <ProvinceSelectFormField />
              {isFetched && <CitySelectFormField data={cityByProvince} />}
            </div>
            <AddressFormField name="addressDetail" label="Address Detail" />
            <PrimarySelectFormField />
            <div className="w-full flex justify-center gap-4 mt-10">
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer "
              >
                <Loader2
                  className={
                    addressMutation.isPending
                      ? "animate-spin w-4 h-4 mr-2"
                      : "hidden"
                  }
                />
                Create Address
              </Button>
            </div>
          </form>
        </Form>
      </div> */}
    </div>
  )
}

export default NewAddressForm
