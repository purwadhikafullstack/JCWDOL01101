// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger, DialogClose, DialogFooter,
// } from "@/components/ui/dialog"
// import service from "@/service";
// import { useDeleteWarehouse, useEditWarehouse, useGetWarehouse, useWarehouseMutation } from "@/hooks/useWarehouse";
// import { response } from "express";

// const Warehouse = () => {
//   type WarehouseType = {
//     id: number;
//     capacity: number;
//     name: string;
//     userId: number;
//   };

//   const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
//   const [newWarehouse, setNewWarehouse] = useState({ name: '', capacity: 0, });
//   const [editWarehouse, setEditWarehouse] = useState({ id: 0, name: '', capacity: 0, });
//   const [isEditing, setIsEditing] = useState(false);

//   // const [cities, setCities] = useState<string[]>([]); // State untuk menyimpan data kota
//   // const [selectedCity, setSelectedCity] = useState<string>(''); // State untuk menyimpan kota yang dipilih
//   // const [provinces, setProvinces] = useState<string[]>([]); // State untuk menyimpan data provinsi
//   // const [selectedProvince, setSelectedProvince] = useState<string>(''); // State untuk menyimpan provinsi yang dipilih

//   const [cities, setCities] = useState<string[]>([]);
//   const [selectedCity, setSelectedCity] = useState<string>('');
//   const [selectedProvince, setSelectedProvince] = useState<string>('');

//   const cityProvinceMapping: { [key: string]: string } = {};

//   // const {data} = useGetWarehouse()
//   // const warehouseMutation = useWarehouseMutation()
//   // const warehouseEdit = ({warehouseId}: {warehouseId:number})=>{
//   //   const edit = useEditWarehouse(warehouseId)
//   // }
//   // useEditWarehouse(warehouseId)


//   useEffect(() => {
//     // Panggil API untuk mendapatkan data kota
//     service.get("/cities/get")
//       .then(response => {
//         if (Array.isArray(response.data.data)) {
//           const cityData: string[] = response.data.data.map((cityInfo: { city: string }) => cityInfo.city);
//           setCities(cityData);
//         } else {
//           console.error("Data is not an array:", response.data.data);
//         }
//       })
//       .catch(error => {
//         console.error("There was an error!", error);
//       });

//     service.get("/warehouses/get")
//       .then(response => {
//         if (Array.isArray(response.data.data)) {
//           setWarehouses(response.data.data);
//         } else {
//           console.error("Data is not an array:", response.data.data);
//         }
//       })

//       .catch(error => {
//         console.error("There was an error!", error);
//       });
//   }, []);

//   useEffect(() => {
//     // Fetch province based on the selectedCity
//     if (selectedCity) {
//       service.get(`/provinces/get?city=${selectedCity}`)
//         .then(response => {
//           if (Array.isArray(response.data.data)) {
//             const provinceData: { province: string }[] = response.data.data;
//             const selectedProvince = provinceData.length > 0 ? provinceData[0].province : '';
//             setSelectedProvince(selectedProvince);
//           } else {
//             console.error("Data is not an array:", response.data.data);
//           }
//         })
//         .catch(error => {
//           console.error("There was an error!", error);
//         });
//     }
//   }, [selectedCity]);
  


//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setNewWarehouse({ ...newWarehouse, [event.target.name]: event.target.value });
//   };

//   const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedCity = event.target.value;
//     setSelectedCity(selectedCity);
//   };

//   const handleAddWarehouse = () => {
//     service.post("/warehouses/post", { ...newWarehouse, city: selectedCity, province: selectedProvince })
//       .then(response => {
//         setWarehouses([...warehouses, response.data]);
//       })
//       .catch(error => {
//         console.error("There was an error!", error);
//       });
//   };

//   const handleEditWarehouse = (warehouse: WarehouseType) => {
//     setEditWarehouse(warehouse);
//     setIsEditing(true);
//   };


//   const handleUpdateWarehouse = () => {
//     service.put(`/warehouses/put/${editWarehouse.id}`, editWarehouse)
//       .then(response => {
//         setWarehouses(warehouses.map(warehouse => warehouse.id === response.data.id ? response.data : warehouse));
//         setIsEditing(false);
//       })
//       .catch(error => {
//         console.error("There was an error!", error);
//       });
//   };

//   const handleDeleteWarehouse = (id: number) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete Warehouse?");
//     if (confirmDelete) {
//       service.delete(`/warehouses/delete/${id}`)
//         .then(() => {
//           setWarehouses(warehouses.filter(warehouse => warehouse.id !== id));
//         })
//         .catch(error => {
//           console.error("There was an error!", error);
//         });
//     }
//   };

//   return (
//     <div className="flex flex-col p-2 w-full">
//       <Dialog>
//         <DialogTrigger>
//           <Button className="self-end" >
//             <Plus className="w-4 h-4 mr-2" /> New Warehouse
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//         <div className="p-4">
//           <h2 className="text-lg font-bold mb-2">Add New Warehouse</h2>
//           <form>
//             <label className="block mb-2">
//               Name:
//               <input type="text" name="name" value={newWarehouse.name} onChange={handleInputChange} required className="mt-1 p-2 border rounded" />
//             </label>
//             <label className="block mb-2">
//               Capacity:
//               <input type="number" name="capacity" value={newWarehouse.capacity} onChange={(e) => setNewWarehouse({ ...newWarehouse, capacity: Number(e.target.value) })} required className="mt-1 p-2 border rounded" />
//             </label>
//             <label className="block mb-2">
//               City:
//               <select name="city" value={selectedCity} onChange={handleCityChange} className="mt-1 p-2 border rounded">
//                 <option value="">Select City</option>
//                 {cities.map((city, index) => (
//                   <option key={index} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <label className="block mb-2">
//               Province:
//               <input type="text" name="province" value={selectedProvince} readOnly className="mt-1 p-2 border rounded" />
//             </label>
//           </form>
//           <div className="mt-4 flex justify-end">
//             <DialogClose asChild>
//               <Button className="mr-2">
//                 Close
//               </Button>
//             </DialogClose>
//             <DialogClose asChild>
//               <Button onClick={handleAddWarehouse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                 Save Changes
//               </Button>
//             </DialogClose>
//           </div>
//         </div>
//       </DialogContent>
//       </Dialog>
//       {isEditing && (
//         <Dialog open={isEditing}>
//           <DialogTitle>Edit Warehouse</DialogTitle>
//           <DialogContent>
//             <label>
//               Name:
//               <input type="text" name="name" value={editWarehouse.name} onChange={(e) => setEditWarehouse({ ...editWarehouse, name: e.target.value })} />
//             </label>
//             <label>
//               Capacity:
//               <input type="number" name="capacity" value={editWarehouse.capacity} onChange={(e) => setEditWarehouse({ ...editWarehouse, capacity: Number(e.target.value) })} />
//             </label>
//             <DialogFooter>
//               <Button onClick={handleUpdateWarehouse}>Update</Button>
//               <Button onClick={() => setIsEditing(false)}>Cancel</Button>
//             </DialogFooter>
//           </DialogContent>

//         </Dialog>
//       )}
//       <div className="border rounded-md mt-8">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Capacity</TableHead>
//               <TableHead>Address</TableHead>
//               <TableHead>Province</TableHead>
//               <TableHead>City</TableHead>
//               <TableHead>Admin</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {warehouses.map((warehouse) => (
//               <TableRow key={warehouse.id}>
//                 <TableCell className="font-medium">{warehouse.name}</TableCell>
//                 <TableCell>{warehouse.capacity}</TableCell>
//                 <TableCell>{/*{.addressDetail}*/}</TableCell>
//                 <TableCell>{/*{.province}*/}</TableCell>
//                 <TableCell>{/*{.city}*/}</TableCell>
//                 <TableCell>{warehouse.userId}</TableCell>
//                 <Button onClick={() => handleEditWarehouse(warehouse)} className="self-end mt-1.5 mr-1">
//                   Edit
//                 </Button>
//                 <Button className="self-end mt-1.5 mr-1">
//                   Disable
//                 </Button>
//                 <Button onClick={() => handleDeleteWarehouse(warehouse.id)}>
//                   Delete
//                 </Button>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default Warehouse;

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger, DialogClose, DialogFooter,
} from "@/components/ui/dialog"
import service from "@/service";
import { useDeleteWarehouse, useEditWarehouse, useGetWarehouse, useWarehouseMutation } from "@/hooks/useWarehouse";
import { response } from "express";

const Warehouse = () => {
  type WarehouseType = {
    id: number;
    capacity: number;
    name: string;
    userId: number;
  };

  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [newWarehouse, setNewWarehouse] = useState({ name: '', capacity: 0,  });
  const [editWarehouse, setEditWarehouse] = useState({ id: 0, name: '', capacity: 0, });
  const [isEditing, setIsEditing] = useState(false);


  // const {data} = useGetWarehouse()
  // const warehouseMutation = useWarehouseMutation()
  // const warehouseEdit = ({warehouseId}: {warehouseId:number})=>{
  //   const edit = useEditWarehouse(warehouseId)
  // }
  // useEditWarehouse(warehouseId)


  useEffect(() => {
    service.get("/warehouses/get")
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewWarehouse({ ...newWarehouse, [event.target.name]: event.target.value });
  };

  const handleAddWarehouse = () => {
    service.post("/warehouses/post", newWarehouse)
      .then(response => {
        setWarehouses([...warehouses, response.data]);
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
    // warehouseMutation.mutate(newWarehouse)
  };

  const handleEditWarehouse = (warehouse: WarehouseType) => {
    setEditWarehouse(warehouse);
    setIsEditing(true);
  };

  const handleUpdateWarehouse = () => {
    service.put(`/warehouses/put/${editWarehouse.id}`, editWarehouse)
      .then(response => {
        setWarehouses(warehouses.map(warehouse => warehouse.id === response.data.id ? response.data : warehouse));
        setIsEditing(false);
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  };

  const handleDeleteWarehouse = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete Warehouse?");
    if (confirmDelete) {
      service.delete(`/warehouses/delete/${id}`)
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
      <Dialog>
        <DialogTrigger>
          <Button className="self-end" >
            <Plus className="w-4 h-4 mr-2" /> New Warehouse
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">Add New Warehouse</h2>
            <form>
              <label className="block mb-2">
                Name:
                <input type="text" name="name" value={newWarehouse.name} onChange={handleInputChange} required className="mt-1 p-2 border rounded" />
              </label>
              <label className="block mb-2">
                Capacity:
                <input type="number" name="capacity" value={newWarehouse.capacity} onChange={(e) => setNewWarehouse({ ...newWarehouse, capacity: Number(e.target.value) })} required className="mt-1 p-2 border rounded" />
              </label>
            </form>
            <div className="mt-4 flex justify-end">
              <DialogClose asChild>
                <Button className="mr-2">
                  Close
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleAddWarehouse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Save Changes
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
            <label>
              Name:
              <input type="text" name="name" value={editWarehouse.name} onChange={(e) => setEditWarehouse({ ...editWarehouse, name: e.target.value })} />
            </label>
            <label>
              Capacity:
              <input type="number" name="capacity" value={editWarehouse.capacity} onChange={(e) => setEditWarehouse({ ...editWarehouse, capacity: Number(e.target.value) })} />
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
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell className="font-medium">{warehouse.name}</TableCell>
                <TableCell>{warehouse.capacity}</TableCell>
                <TableCell>{/*{.addressDetail}*/}</TableCell>
                <TableCell>{/*{.province}*/}</TableCell>
                <TableCell>{/*{.city}*/}</TableCell>
                <TableCell>{warehouse.userId}</TableCell>
                <Button onClick={() => handleEditWarehouse(warehouse)} className="self-end mt-1.5 mr-1">
                  Edit
                </Button>
                <Button className="self-end mt-1.5 mr-1">
                  Disable
                </Button>
                <Button onClick={() => handleDeleteWarehouse(warehouse.id)}>
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