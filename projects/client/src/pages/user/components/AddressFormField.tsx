import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { useFormContext } from "react-hook-form"

type AddressFormFieldProps = {
  name: string
  label: string
  description?: string
}
const AddressFormField = ({
  name,
  label,
  description,
}: AddressFormFieldProps) => {
  const { control } = useFormContext()
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

export default AddressFormField
