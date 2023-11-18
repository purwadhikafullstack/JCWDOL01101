import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from '@/components/ModalAddWarehouse';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import service from "@/service";

const Warehouse = () => {
  type WarehouseType = {
    id: number;
    capacity: number;
    name: string;
    address: string;
    province: string;
    city: string;
    userId: number;
  };

  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [showModal, setShowModal] = useState(false);
  // const [editingWarehouse, setEditingWarehouse] = useState({ name: '', capacity: '' });
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseType | null>(null);

  useEffect(() => {
    service.get("http://localhost:8000/warehouses/get")
      .then(response => {
        if (Array.isArray(response.data.data)) {
          setWarehouses(response.data.data);
        } else {
          console.error("Data is not an array:", response.data.data);
        }
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleOpenModal = () => {
    setEditingWarehouse(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (warehouse: WarehouseType) => {
    setEditingWarehouse(warehouse);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingWarehouse(null);
    setShowModal(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingWarehouse) {
      setEditingWarehouse({ ...editingWarehouse, [event.target.name]: event.target.value });
    }
  };

  const handleAddWarehouse = () => {
    if (editingWarehouse) {
      const newWarehouse = { name: editingWarehouse.name, capacity: editingWarehouse.capacity };
      service.post("http://localhost:8000/warehouses/post", newWarehouse)
        .then(response => {
          setWarehouses([...warehouses, response.data]);
          setShowModal(false);
          setEditingWarehouse(null);
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    }
  };

  const handleEditWarehouse = () => {
    if (editingWarehouse) {
      service.put(`http://localhost:8000/warehouses/put/${editingWarehouse.id}`, editingWarehouse)
        .then(response => {
          setWarehouses(warehouses.map(warehouse => warehouse.id === editingWarehouse.id ? response.data : warehouse));
          setShowModal(false);
          setEditingWarehouse(null);
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    }
  };

  const handleDeleteWarehouse = (id: number) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      service.delete(`http://localhost:8000/warehouses/delete/${id}`)
        .then(() => {
          setWarehouses(warehouses.filter(warehouse => warehouse.id !== id));
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    }
  };
  
  return (
    <div className="flex flex-col p-2 w-full">
      <Button className="self-end" onClick={handleOpenModal}>
        <Plus className="w-4 h-4 mr-2" /> New Warehouse
      </Button>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
          <form>
            <label className="block mb-2">
              Name:
              <input type="text" name="name"  onChange={handleInputChange} required className="mt-1 p-2 border rounded" />
            </label>
            <label className="block mb-2">
              Capacity:
              <input type="number" name="capacity"  onChange={handleInputChange} required className="mt-1 p-2 border rounded" />
            </label>
          </form>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleCloseModal} className="mr-2">
              Close
            </Button>
            <Button onClick={editingWarehouse ? handleEditWarehouse : handleAddWarehouse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <div className="border rounded-md mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell className="font-medium">{warehouse.name}</TableCell>
                <TableCell>{warehouse.capacity}</TableCell>
                <TableCell>{warehouse.address}</TableCell>
                <TableCell>{warehouse.province}</TableCell>
                <TableCell>{warehouse.city}</TableCell>
                <TableCell>{warehouse.userId}</TableCell>
                <Button className="self-end mt-1.5 mr-1" onClick={() => handleOpenEditModal(warehouse)}>
                  Edit
                </Button>
                <Button className="self-end mt-1.5 mr-1">
                  Disable
                </Button>
                <Button className="self-end mt-1.5" onClick={() => handleDeleteWarehouse(warehouse.id)}>
                  Delete
                </Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Warehouse;
