import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import service from "@/service"
import { useParams } from 'react-router-dom';


type WarehouseType = {
    id: number;
    name: string;
    capacity: number;
    addressId: number;
    userId: number;
};

const AssignAdminForm: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>(undefined);

    const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);

    useEffect(() => {
        service.get('/warehouses').then((response) => {
            console.log(response.data); // tambahkan ini
            setWarehouses(response.data.data);
        });
    }, []);

    const handleSubmit = () => {
        if (selectedWarehouse === "unassign") {
          service.put(`/warehouses/unassign/${userId}`);
        } else {
          service.put(`/warehouses/${selectedWarehouse}/assign/${userId}`);
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <div className="w-[180px]">
            <select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="">Select a Warehouse</option>
              <option value="unassign">Unassign</option>
              {warehouses.map((warehouse) => (
                !warehouse.userId ? (
                  <option key={warehouse.id.toString()} value={warehouse.id.toString()}>
                    {warehouse.name}
                  </option>
                ) : null
              ))}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      );
}

export default AssignAdminForm