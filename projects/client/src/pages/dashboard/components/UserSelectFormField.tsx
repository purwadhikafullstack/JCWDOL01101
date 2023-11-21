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

const UserSelectFormField = ({ select }: { select: number }) => {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={select === 0 ? "role" : "status"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{select === 0 ? "Role" : "Status"}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Select ${select === 0 ? "Role" : "Status"}`}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {select === 0
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
