import React from "react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProvince } from "@/hooks/useAddress"
import { useFormContext } from "react-hook-form"

const ProvinceSelectFormField = () => {
  const { control } = useFormContext()
  const { data, isFetched } = useProvince()
  return (
    <FormField
      control={control}
      name="provinceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Province</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isFetched &&
                data?.map(({ province, id }) => (
                  <SelectItem key={id} value={id.toString()}>
                    {province}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default ProvinceSelectFormField
