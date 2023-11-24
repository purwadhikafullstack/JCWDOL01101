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

const UserSelectFormField = () => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name="isPrimary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select this address as primary address</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select Primary`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default UserSelectFormField
