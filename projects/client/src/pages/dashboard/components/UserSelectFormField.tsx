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
import React from "react"
import { useFormContext } from "react-hook-form"

type UserSelectFormFieldProps = {
  name: string
  label: string
}

const role = [
  {
    value: "CUSTOMER",
    category: "Customer",
  },
  {
    value: "ADMIN",
    category: "Admin",
  },
  {
    value: "WAREHOUSE",
    category: "Warehouse admin",
  },
]

const status = [
  {
    value: "ACTIVE",
    category: "Active",
  },
  {
    value: "DEACTIVATED",
    category: "Deactivated",
  },
]

const UserSelectFormField = ({ name, label }: UserSelectFormFieldProps) => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {name === "role"
                ? role.map(({ category, value }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {category}
                    </SelectItem>
                  ))
                : status.map(({ category, value }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {category}
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

export default UserSelectFormField
