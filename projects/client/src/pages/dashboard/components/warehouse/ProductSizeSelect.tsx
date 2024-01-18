import React from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { useInventoryByWarehouseId } from "@/hooks/useInventory"

type Props = {
  productId: number | undefined
  warehouseId: string | undefined
}
const ProductSizeSelect = ({ productId, warehouseId }: Props) => {
  const form = useFormContext()
  const { data: inventory } = useInventoryByWarehouseId(productId, warehouseId)
  return (
    <FormField
      control={form.control}
      name="sizeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product Size</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Product Size" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {inventory &&
                inventory.map((inv) => (
                  <SelectItem key={inv.id} value={inv.sizeId.toString()}>
                    {inv.sizes.label} ({inv.stock})
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

export default ProductSizeSelect
