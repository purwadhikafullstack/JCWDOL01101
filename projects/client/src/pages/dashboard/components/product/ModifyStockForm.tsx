import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/hooks/useProduct";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInventoryMutation } from "@/hooks/useInventoryMutation";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const stockSchema = z.object({
  sizeId: z.string().min(1, "Required"),
  newStock: z.coerce.number().gt(0, "Must be greater than 0"),
  notes: z.string().optional(),
});

type Props = {
  product: Product;
  setOpen: (open: boolean) => void;
};
const ModifyStockForm = ({ product, setOpen }: Props) => {
  const [currentModalOpen, setCurrentModalOpen] = useState(false);
  const { inventory } = product;
  if (!inventory) {
    return null;
  }

  const [searchParams] = useSearchParams();
  const warehouseId = searchParams.get("warehouse");
  const sizes = new Map();
  for (const inv of inventory) {
    if (!sizes.has(inv.sizes.id)) {
      sizes.set(inv.sizes.id, inv.stock);
    }
  }
  const stockMutation = useInventoryMutation();
  const form = useForm<z.infer<typeof stockSchema>>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      sizeId: "",
      newStock: 0,
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof stockSchema>) => {
    if (warehouseId) {
      stockMutation.mutate({
        warehouseId,
        productId: product.id,
        sizeId: Number(values.sizeId),
        stock: Number(values.newStock),
        notes: values.notes,
      });
    }
  };

  useEffect(() => {
    if (stockMutation.isSuccess) {
      setOpen(false);
      setCurrentModalOpen(false);
    }
  }, [stockMutation.isSuccess]);
  return (
    <Form {...form}>
      <form
        id="modify-stock-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="sizeId"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4">
                <FormLabel>Product Size</FormLabel>
                <div className="col-span-3">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product Size" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      {inventory.map((inv) => (
                        <SelectItem
                          key={inv.sizes.id}
                          value={inv.sizes.id.toString()}
                        >
                          {inv.sizes.label} ({inv.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pick the product size you want to modify
                  </FormDescription>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-4">
          <Label>Current Stock</Label>
          <div className="col-span-3">
            <Input
              disabled={true}
              defaultValue={sizes.get(+form.getValues("sizeId"))}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="newStock"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4">
                <FormLabel>New Stock</FormLabel>
                <div className="col-span-3">
                  <Input
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.match(/^[0-9]+$/) && +value >= 0) {
                        field.onChange(e);
                      }
                    }}
                    placeholder="Input Your New Stock"
                  />
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-4">
                <FormLabel>Notes</FormLabel>
                <div className="col-span-3">
                  <Textarea {...field} />
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />
        <Dialog open={currentModalOpen} onOpenChange={setCurrentModalOpen}>
          <Button
            type="button"
            onClick={async () => {
              const result = await form.trigger();
              if (result) {
                setCurrentModalOpen(true);
              }
            }}
            className={buttonVariants({ variant: "default" })}
          >
            Modify Stock
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to modify stock?</DialogTitle>
              <DialogDescription>
                This action will modify the stock of selected product
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-start">
              <DialogFooter>
                <Button
                  disabled={stockMutation.isPending}
                  form="modify-stock-form"
                  type="submit"
                >
                  {stockMutation.isPending && (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  )}
                  Yes, Modify Stock
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default ModifyStockForm;
