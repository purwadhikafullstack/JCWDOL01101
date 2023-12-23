import { useGetWarehouseById } from "@/hooks/useWarehouse";
import { Pin } from "lucide-react";
import React from "react";
import { useSearchParams } from "react-router-dom";

const CurrentWarehouseDetail = () => {
  const [params] = useSearchParams();
  const warehouseId = params.get("warehouse") || undefined;
  const { data: warehouse } = useGetWarehouseById(warehouseId);
  return (
    <div>
      <h2 className="font-bold text-sm">Current Warehouse Detail:</h2>
      <h3 className="font-bold">{warehouse?.name}</h3>
      <span className="flex items-center text-sm text-muted-foreground">
        <Pin className="w-4 h-4 mr-2" />
        <p>
          {warehouse?.warehouseAddress?.addressDetail},{" "}
          {warehouse?.warehouseAddress?.cityWarehouse?.cityName},{" "}
          {warehouse?.warehouseAddress?.cityWarehouse?.cityProvince.province}
        </p>
      </span>
    </div>
  );
};

export default CurrentWarehouseDetail;
