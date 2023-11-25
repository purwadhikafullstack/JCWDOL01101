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
import { useFormContext } from "react-hook-form"
import { City } from "@/hooks/useAddress"

type CitySelectFormField = {
  data?: City[]
}

const CitySelectFormField: React.FC<CitySelectFormField> = ({ data }) => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name="cityId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select City</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data?.map(({ city, id }) => (
                <SelectItem key={id} value={id.toString()}>
                  {city}
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

export default CitySelectFormField
