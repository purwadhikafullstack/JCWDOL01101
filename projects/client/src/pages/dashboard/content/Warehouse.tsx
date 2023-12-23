import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import service from "@/service";
import { Input } from "@/components/ui/input";

type WarehouseAddressType = {
  id: number;
  addressDetail: string;
  cityId: string;
  provinceId: number;
  cityWarehouse?: CityType;
};

type WarehouseType = {
  id: number;
  name: string;
  capacity: number;
  addressId: number;
  userId: number;
  warehouseAddress?: WarehouseAddressType;
};

type CityType = {
  cityId: string;
  cityName: string;
  provinceId: string;
  postal_code: number;
  cityProvince?: ProvinceType;
};

type ProvinceType = {
  provinceId: string;
  province: string;
};

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    capacity: 0,
    addressDetail: "",
  });
  const [editWarehouse, setEditWarehouse] = useState({
    id: 0,
    name: "",
    capacity: 0,
    addressId: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  const [cities, setCities] = useState<CityType[]>([]);
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityType | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceType | null>(
    null
  );
  const [editAddress, setEditAddress] = useState({
    addressDetail: "",
  });

  useEffect(() => {
    service
      .get("/warehouses")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setWarehouses(response.data.data);
        } else {
          console.error("Data is not an array:", response.data.data);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    service
      .get("/cities")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setCities(response.data.data);
        } else {
          console.error("Data is not an array:", response.data.data);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    service
      .get("/provinces")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setProvinces(response.data.data);
        } else {
          console.error("Data is not an array:", response.data.data);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = cities.find(
      (city) => city.cityId === String(event.target.value)
    );
    if (city) {
      setSelectedCity(city);
      const province = provinces.find(
        (province) => province.provinceId === city.provinceId
      );
      if (province) {
        setSelectedProvince(province);
      } else {
        setSelectedProvince(null);
      }
    } else {
      setSelectedCity(null);
      setSelectedProvince(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewWarehouse({
      ...newWarehouse,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddWarehouse = () => {
    const addressData = {
      cityId: selectedCity?.cityId,
      provinceId: selectedProvince?.provinceId,
      addressDetail: newWarehouse.addressDetail,
    };

    service
      .post("/warehouseAddresses", addressData)
      .then((response) => {
        const newAddressId = response.data.data.id;
        const warehouseData = {
          ...newWarehouse,
          warehouseAddressId: newAddressId,
        };

        service
          .post("/warehouses", warehouseData)
          .then((response) => {
            setWarehouses([...warehouses, response.data]);
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleEditWarehouse = (warehouse: WarehouseType) => {
    setEditWarehouse(warehouse);
    setEditAddress({
      addressDetail: warehouse.warehouseAddress?.addressDetail || "",
    });
    setSelectedCity(warehouse.warehouseAddress?.cityWarehouse || null);
    setSelectedProvince(
      warehouse.warehouseAddress?.cityWarehouse?.cityProvince || null
    );
    setIsEditing(true);
  };

  const handleUpdateWarehouse = () => {
    const addressData = {
      cityId: selectedCity?.cityId,
      provinceId: selectedProvince?.provinceId,
      addressDetail: editAddress.addressDetail,
    };

    service
      .put(`/warehouseAddresses/${editWarehouse.id}`, addressData)
      .then((response) => {
        const warehouseData = {
          ...editWarehouse,
          addressId: response.data.id,
        };

        service
          .put(`/warehouses/${editWarehouse.id}`, warehouseData)
          .then((response) => {
            setWarehouses(
              warehouses.map((warehouse) =>
                warehouse.id === response.data.id ? response.data : warehouse
              )
            );
            setIsEditing(false);
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleDeleteWarehouse = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete Warehouse?"
    );
    if (confirmDelete) {
      service
        .delete(`/warehouses/${id}`)
        .then(() => {
          service
            .get("/warehouses")
            .then((response) => {
              if (Array.isArray(response.data.data)) {
                setWarehouses(response.data.data);
              } else {
                console.error("Data is not an array:", response.data.data);
              }
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  };

  return (
    <div className="flex flex-col p-2 w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="self-end">
            <Plus className="w-4 h-4 mr-2" /> New Warehouse
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Add New Warehouse</h2>
            <form className="space-y-2">
              <div className="grid grid-cols-2">
                <label className=" mb-2 flex justify-between">Name:</label>
                <Input
                  type="text"
                  name="name"
                  value={newWarehouse.name}
                  onChange={handleInputChange}
                  required
                  className=""
                />
              </div>
              <div className="grid grid-cols-2">
                <label className="mb-2 flex justify-between">Capacity:</label>
                <Input
                  type="number"
                  name="capacity"
                  value={newWarehouse.capacity}
                  onChange={(e) =>
                    setNewWarehouse({
                      ...newWarehouse,
                      capacity: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2">
                <label className=" mb-2 flex justify-between">
                  Address Detail:
                </label>
                <Input
                  type="text"
                  name="addressDetail"
                  value={newWarehouse.addressDetail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2">
                <label className="mb-2 flex justify-between">City:</label>
                <select
                  name="cityName"
                  value={selectedCity?.cityId || ""}
                  onChange={handleCityChange}
                  required
                  className="mt-1 p-2 border rounded bg-background"
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.cityId} value={city.cityId}>
                      {city.cityName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2">
                <label className=" mb-2 flex justify-between">Province:</label>
                <Input
                  type="text"
                  value={selectedProvince?.province || ""}
                  readOnly
                  className="mt-1 p-2 border rounded"
                />
              </div>
            </form>
            <div className="mt-4 flex gap-2 items-center justify-start">
              <Button onClick={handleAddWarehouse}>Save Changes</Button>
              <DialogClose asChild>
                <Button variant="secondary" className="mr-2">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isEditing && (
        <Dialog open={isEditing}>
          <DialogTitle>Edit Warehouse</DialogTitle>
          <DialogContent>
            <h2 className="text-lg font-bold mb-2">Edit Warehouse</h2>
            <label className=" flex justify-between">
              Name:
              <Input
                type="text"
                name="name"
                value={editWarehouse.name}
                onChange={(e) =>
                  setEditWarehouse({ ...editWarehouse, name: e.target.value })
                }
                className="bg-background"
              />
            </label>
            <label className=" flex justify-between">
              Capacity:
              <input
                type="number"
                name="capacity"
                value={editWarehouse.capacity}
                onChange={(e) =>
                  setEditWarehouse({
                    ...editWarehouse,
                    capacity: Number(e.target.value),
                  })
                }
                className="p-2 border rounded"
              />
            </label>
            <label className=" flex justify-between">
              Address Detail:
              <input
                type="text"
                name="addressDetail"
                value={editAddress.addressDetail}
                onChange={(e) =>
                  setEditAddress({
                    ...editAddress,
                    addressDetail: e.target.value,
                  })
                }
                className="mt-1 p-2 border rounded"
              />
            </label>
            <label className=" flex justify-between">
              City:
              <select
                name="cityName"
                value={selectedCity?.cityId || ""}
                onChange={handleCityChange}
                className="p-2 border rounded"
              >
                <option value="">{selectedCity?.cityName}</option>
                {cities.map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.cityName}
                  </option>
                ))}
              </select>
            </label>
            <label className=" flex justify-between">
              Province:
              <input
                type="text"
                value={selectedProvince?.province || ""}
                readOnly
                className="p-2 border rounded"
              />
            </label>
            <DialogFooter>
              <Button onClick={handleUpdateWarehouse}>Update</Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
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
            {warehouses.length > 0 &&
              warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">
                    {warehouse.name}
                  </TableCell>
                  <TableCell>{warehouse.capacity}</TableCell>
                  <TableCell>
                    {warehouse.warehouseAddress?.addressDetail}
                  </TableCell>
                  <TableCell>
                    {
                      warehouse.warehouseAddress?.cityWarehouse?.cityProvince
                        ?.province
                    }
                  </TableCell>
                  <TableCell>
                    {warehouse.warehouseAddress?.cityWarehouse?.cityName}
                  </TableCell>
                  <TableCell>{warehouse.userId}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEditWarehouse(warehouse)}
                      className="self-end mt-1.5 mr-1"
                    >
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteWarehouse(warehouse.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Warehouse;
