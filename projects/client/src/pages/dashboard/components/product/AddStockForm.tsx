import React, { useState } from 'react';
import { useGetWarehouse } from '@/hooks/useWarehouse';
import { Product } from "@/hooks/useProduct";
import { useProducts } from '@/hooks/useProduct';
import { Select } from '@/components/ui/select';
import service from '@/service';
import { Button } from '@/components/ui/button';

interface StockProps {
  productId: number | undefined;
  selectedWarehouse: string | undefined;
}

const AddStockForm = ({ productId, selectedWarehouse }: StockProps) => {
  const { data: products } = useProducts({
    page: 1,
    s: '',
    filter: '',
    order: '',
    limit: 10,
    warehouse: '',
  });

  const { data: warehouses } = useGetWarehouse();
  const selectedProduct = productId;
  // const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const selectedWarehousee = selectedWarehouse
  const [stock, setStock] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await service.put(`/inventories/add-stock`, {
        productId: selectedProduct,
        warehouseId: selectedWarehousee,
        stock: stock,
      });
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h1> Qty </h1>
      <div className="w-[180px]">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
        />
        <input
          type='text'
          placeholder='notes'
        />
      </div>


      <Button type="submit">Add Stock</Button>
    </form>
  );
};

export default AddStockForm;
