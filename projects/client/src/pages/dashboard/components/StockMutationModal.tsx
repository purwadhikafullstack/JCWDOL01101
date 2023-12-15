import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProduct";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type StockMutationModalProps = {
  product: Product;
};
const StockMutationModal = ({ product }: StockMutationModalProps) => {
  const sizes = new Map();
  for (const inv of product.inventory) {
    if (!sizes.has(inv.sizes.id)) {
      sizes.set(inv.sizes.id, inv.stock);
    }
  }
  const [currentSize, setCurrentSize] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-2 text-sm">
          <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
          Modify Stock
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-10">
            Modify Stock : {product.name}
          </DialogTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-2">
              <p>Product Size</p>
              <Select onValueChange={(value) => setCurrentSize(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent align="end">
                  {product.inventory.map((inv) => (
                    <SelectItem
                      key={inv.sizes.id}
                      value={inv.sizes.id.toString()}
                    >
                      {inv.sizes.label} ({inv.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2">
              <p>Current Stock</p>
              <Input disabled={true} defaultValue={sizes.get(+currentSize)} />
            </div>
            <div className="grid grid-cols-2">
              <p>New Stock</p>
              <Input />
            </div>
            <div className="grid grid-cols-2">
              <p>Notes</p>
              <Textarea />
            </div>
            <Button className="w-full">Modify Stock</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default StockMutationModal;
