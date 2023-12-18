import React, { useEffect, useState } from 'react';
import service from '@/service';
import { Button } from '@/components/ui/button';
import z from "zod";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StockProps {
  productId: number | undefined;
  selectedWarehouse: string | undefined;
  productName: string | undefined;
}

const formSchema = z.object({
  notes: z.string().min(2).max(50),
});

const AddStockForm = ({ productId, selectedWarehouse, productName }: StockProps) => {
  const selectedProduct = productId;
  const [selectedInventory, setSelectedInventory] = useState('')

  const selectedWarehousee = selectedWarehouse
  const [stock, setStock] = useState('');
  const [notes, setNotes] = useState('');
  const [oldQty, setOldQty] = useState(0);

  const [currentStock, setCurrentStock] = useState(0);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await service.get(`/inventories/${selectedWarehouse}/${selectedProduct}`);
        if (response.status === 200) {
          setCurrentStock(response.data.data.stock);
          setSelectedInventory(response.data.data.id);
          setOldQty(response.data.data.stock)
        }
      } catch (error) {
        console.error('Fetch inventory error:', error);
      }
    };
    if (selectedProduct && selectedWarehouse) {
      fetchInventoryData();
    }
  }, [selectedProduct, selectedWarehouse]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const confirmChange = window.confirm(
      "Are you sure you want to change stock"
    );
    if (confirmChange) {
      const qtyChange = Number(stock) - oldQty;
      const type = qtyChange >= 0 ? 'STOCK IN' : 'STOCK OUT';

      e.preventDefault();
      try {
        const response = await service.put(`/inventories/add-stock`, {
          productId: selectedProduct,
          warehouseId: selectedWarehousee,
          stock: stock,
        });

        const jurnalResp = await service.post(`/jurnals`, {
          inventoryId: selectedInventory,
          notes: notes,
          oldQty: oldQty,
          newQty: stock,
          qtyChange: Math.abs(qtyChange),
          type: type,
          date: new Date(),
        });
      } catch (error) {
        console.error(error);
      }
    }

  };
  return (
    <DialogContent className='w-[400px]'>
      <DialogTitle>Manage Stock of {productName}</DialogTitle>
      <DialogDescription>Current Quantity : {currentStock}</DialogDescription>
      <form onSubmit={handleSubmit} >
        <div className="w-[280px] items-center grid gap-3 ">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right"> Stock </Label>
            <Input
              id="stock"
              className="col-span-3"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right"> notes </Label>
            <Input
              id='notes'
              className="col-span-3"
              type='text'
              placeholder='notes'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button type="submit" className='mt-4'>Submit</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddStockForm;
