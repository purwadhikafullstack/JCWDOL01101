import { Button } from "@/components/ui/button";
import {
  useChangeStatus,
  useChangeStatusInventory,
} from "@/hooks/useProductMutation";
import { useGetWarehouseById } from "@/hooks/useWarehouse";
import { Loader2, MapPin } from "lucide-react";
import React from "react";
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
        onClick={onDeleteProduct}
        variant="destructive"
        className="cursor-pointer w-full"
      >
        <Loader2
          className={
            deleteProduct.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
          }
        />
        Yes, delete on all warehouse
      </Button>
      <div className="space-y-2">
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
            <p>Yes, delete on ({warehouse?.name})</p>
          </div>
        </Button>
        <span className="flex gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />{" "}
          {warehouse?.warehouseAddress?.cityWarehouse?.cityName}
        </span>
      </div>
    </div>
  );
};

export default DeleteProduct;
