import React from "react"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useGetWarehouse } from "@/hooks/useWarehouse"

function SenderWarehouseField() {
  const form = useFormContext()
  const { data: warehouses, isLoading } = useGetWarehouse()
  return (
    <FormField
      control={form.control}
      name="senderWarehouseId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Request Warehouse From</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse who need stock" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <div className="text-center">
                  <Loader2 className="animate-spin " />
                </div>
              ) : (
                <>
                  {warehouses && warehouses.length > 0 ? (
                    <>
                      {warehouses.map((warehouse) => (
                        <SelectItem
                          key={warehouse.id}
                          value={String(warehouse.id)}
                        >
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <p className="text-center p-2 mx-auto">
                      no warehouse found
                    </p>
                  )}
                </>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default SenderWarehouseField
