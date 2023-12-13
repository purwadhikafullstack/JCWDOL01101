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
import { useWarehouse } from "@/hooks/useInventory"
import { Loader2 } from "lucide-react"

function ReceiverWarehouseField({
  warehouseId,
  productId,
}: {
  warehouseId: number
  productId: number
}) {
  const form = useFormContext()
  const { data: warehouses, isLoading } = useWarehouse(productId, warehouseId)
  return (
    <FormField
      control={form.control}
      name="receiverWarehouseId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Warehouse</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a warehouse based on stock" />
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
                          key={warehouse.warehouseId}
                          value={String(warehouse.warehouseId)}
                        >
                          {warehouse.warehouse.name} | Stock left:{" "}
                          {warehouse.stock}
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

export default ReceiverWarehouseField
