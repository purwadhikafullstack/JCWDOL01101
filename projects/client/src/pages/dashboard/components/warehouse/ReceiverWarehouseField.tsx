import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWarehouse } from "@/hooks/useInventory";
import { Loader2, MapPin } from "lucide-react";
import Hashids from "hashids";

function ReceiverWarehouseField({
  warehouseId,
  productId,
}: {
  productId: number;
  warehouseId: string | undefined;
}) {
  const form = useFormContext();
  const sizeId = Number(form.watch("sizeId")) || undefined;
  const hashids = new Hashids("TOTEN", 10);
  const decodedWarehouseId = warehouseId
    ? Number(hashids.decode(warehouseId))
    : undefined;
  const { data: inventories, isLoading } = useWarehouse(
    sizeId,
    productId,
    decodedWarehouseId
  );
  return (
    <FormField
      control={form.control}
      name="receiverWarehouseId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Warehouse to Request From</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Warehouse" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <div className="text-center">
                  <Loader2 className="animate-spin " />
                </div>
              ) : sizeId ? (
                <>
                  {inventories && inventories.length > 0 ? (
                    <>
                      {inventories.map(({ warehouse, id, stock }) => (
                        <SelectItem key={id} value={warehouse.id.toString()}>
                          <div className="flex gap-2 items-center justify-between">
                            <MapPin className="w-4 h-4 mr-2" />
                            {warehouse.name} ({stock})
                          </div>
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <p className="text-center p-2 break-words">
                      no warehouse available
                    </p>
                  )}
                </>
              ) : (
                <p className="text-center p-2 text-sm text-primary">
                  please select a product size first
                </p>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default ReceiverWarehouseField;
