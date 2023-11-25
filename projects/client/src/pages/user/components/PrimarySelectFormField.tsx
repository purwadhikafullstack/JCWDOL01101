import React from "react"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"

const PrimarySelectFormField = ({
  name,
  label,
}: {
  name: string
  label: string
}) => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <span>{label}</span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default PrimarySelectFormField
