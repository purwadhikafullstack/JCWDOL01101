import React from "react";
import { Button } from "@/components/ui/button";
import {
  useChangeStatus,
  useChangeStatusInventory,
} from "@/hooks/useProductMutation";
import { useGetWarehouseById } from "@/hooks/useWarehouse";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const DeleteProduct = ({ productId }: { productId: number }) => {
  const [params] = useSearchParams();
  const warehouseId = params.get("warehouse") || undefined;
  const { data: warehouse } = useGetWarehouseById(warehouseId);

  const deleteProduct = useChangeStatus();
  const deleteProductInventory = useChangeStatusInventory();
  const onDeleteProduct = () => {
    deleteProduct.mutate({
      productId,
      status: "DELETED",
    });
  };

  const onDeleteProductInventory = () => {
    if (warehouseId) {
      deleteProductInventory.mutate({
        productId,
        warehouseId,
        status: "DELETED",
      });
    }
  };
  return (
    <div className="flex gap-2 w-full">
      <Button
        onClick={onDeleteProductInventory}
        variant="destructive"
        className="cursor-pointer w-full"
      >
        <Loader2
          className={
            deleteProductInventory.isPending
              ? "animate-spin w-4 h-4 mr-2"
              : "hidden"
          }
        />
        <div>
          <p>Delete on ({warehouse?.name})</p>
        </div>
      </Button>
      <Button
        onClick={onDeleteProduct}
        variant="destructive"
        className="cursor-pointer w-full"
      >
        <Loader2
          className={
            deleteProduct.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
          }
        />
        Delete on all warehouse
      </Button>
    </div>
  );
};

export default DeleteProduct;
