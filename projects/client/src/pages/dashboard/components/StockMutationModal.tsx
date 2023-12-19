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
import { Activity } from "lucide-react";
import ModifyStockForm from "./product/ModifyStockForm";

type StockMutationModalProps = {
  product: Product;
};

const StockMutationModal = ({ product }: StockMutationModalProps) => {
  const [open, setOpen] = useState(false);
  const sizes = new Map();
  for (const inv of product.inventory) {
    if (!sizes.has(inv.sizes.id)) {
      sizes.set(inv.sizes.id, inv.stock);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <ModifyStockForm setOpen={setOpen} product={product} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default StockMutationModal;
