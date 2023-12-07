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
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import service from "@/service"
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";

type WarehouseType = {
    id: number;
    name: string;
    capacity: number;
    addressId: number;
    userId: number;
};

const UnassignAdminForm = ({ userId }: { userId: Number }) => {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>(undefined);

    const handleSubmit = () => {
        if (selectedWarehouse === "unassign") {
          service.put(`/warehouses/unassign/${userId}`);
        }
      };

      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unassign Admin</DialogTitle>
            <DialogDescription>
              You're about to Unassign this admin to a warehouse
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="w-[180px]">
              <select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="">Select to Confirm</option>
                <option value="unassign">Unassign</option>
              </select>
            </div>
            <Button type="submit" className="mt-5">Submit</Button>
          </form>
        </DialogContent>
      );
    }

export default UnassignAdminForm