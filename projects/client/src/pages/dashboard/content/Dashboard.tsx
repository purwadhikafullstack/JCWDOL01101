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
  type AddressType = {
    id: number;
    addressDetail: string;
    cityId: number;
    provinceId: number;
    cityData?: CityType; 
  };
  
  
  type WarehouseType = {
    id: number;
    capacity: number;
    name: string;
    addressId: number;
    userId: number;
    address?: AddressType; 
  };
  
  type CityType = {
    id: number;
    city: string;
    provinceId: number;
    postal_code: number;
    provinceData?: ProvinceType; 
  };
  

  type ProvinceType = {
    id: number;
    province: string;
  };


  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [newWarehouse, setNewWarehouse] = useState({ name: '', capacity: 0, addressDetail: '' }); // add addressDetail here
  const [editWarehouse, setEditWarehouse] = useState({ id: 0, name: '', capacity: 0, });
  const [isEditing, setIsEditing] = useState(false);

  const [cities, setCities] = useState<CityType[]>([]);
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityType | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceType | null>(null);

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
      
    service.get("/cities/get")
      .then(response => {
        if (Array.isArray(response.data.data)) {
          setCities(response.data.data);
        } else {
          console.error("Data is not an array:", response.data.data);
        }
      })
      .catch(error => {
        console.error("There was an error!", error);
      });

    service.get("/provinces/get")
      .then(response => {
        if (Array.isArray(response.data.data)) {
          setProvinces(response.data.data);
        } else {
          console.error("Data is not an array:", response.data.data);
        }
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = cities.find(city => city.id === Number(event.target.value));
    if (city) {
      setSelectedCity(city);
      const province = provinces.find(province => province.id === city.provinceId);
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
    setNewWarehouse({ ...newWarehouse, [event.target.name]: event.target.value });
  };

  const handleAddWarehouse = () => {
    const addressData = {
      cityId: selectedCity?.id,
      provinceId: selectedProvince?.id,
      addressDetail: newWarehouse.addressDetail, 
    };
  
    service.post("/addresses/post", addressData)
      .then(response => {
        const newAddressId = response.data.data.id;
        console.log(response);
        
        const warehouseData = {
          ...newWarehouse,
          addressId: newAddressId,
        };


        service.post("/warehouses/post", warehouseData)
          .then(response => {
            setWarehouses([...warehouses, response.data]);
          })
          .catch(error => {
            console.error("There was an error!", error);
          });
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  };
  
  const handleEditWarehouse = (warehouse: WarehouseType) => {
    setEditWarehouse(warehouse);
    setIsEditing(true);
  };

  const handleUpdateWarehouse = () => {
    service.put(`/warehouses/put/${editWarehouse.id}`, { ...editWarehouse, addressDetail: newWarehouse.addressDetail })
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

              <label className="block mb-2">
                Address Detail:
                <input type="text" name="addressDetail" value={newWarehouse.addressDetail} onChange={handleInputChange} required className="mt-1 p-2 border rounded" />
              </label>

              <label className="block mb-2">
                City:
                <select name="city" value={selectedCity?.id || ''} onChange={handleCityChange} required className="mt-1 p-2 border rounded">
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.city}</option>
                  ))}
                </select>
              </label>

              <label className="block mb-2">
                Province:
                <input type="text" value={selectedProvince?.province || ''} readOnly className="mt-1 p-2 border rounded" />
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
                <TableCell>{warehouse.address?.addressDetail}</TableCell> 
                <TableCell>{warehouse.address?.cityData?.provinceData?.province}</TableCell> 
                <TableCell>{warehouse.address?.cityData?.city}</TableCell> 
                <TableCell>{warehouse.userId}</TableCell>
                <Button onClick={() => handleEditWarehouse(warehouse)} className="self-end mt-1.5 mr-1">
                  Edit
                </Button>
                {/* <Button className="self-end mt-1.5 mr-1">
                  Disable
                </Button> */}
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


// import React, {Component} from "react"
// import Axios from "axios"
// import service from "@/service"
// import {connect} from "react-redux"


// class Dashboard extends Component {
//   state = {
//     addressList: [],
//     cityList: [] as { id: number; city: string }[], // Define the type for cityList
//     provinceList: [] as { id: number; province: string }[], // Define the type for provinceList
//     addAddressDetail: '',
//     addCity: '',
//     addProvince: '',
//   }; 

//   fetchAddress=()=>{
//     service.get(`http://localhost:8000/api/addresses/get`)
//     .then((result) => {
//       this.setState({ addressList: result.data });
//     })
//     .catch(() => {
//       alert("Terjadi kesalahan di server");
//     });
//   }

//   fetchCity = ()=>{
//     service.get(`/cities/get`)
//     .then((result)=>{
//       this.setState({cityList:result.data})
//     }).catch(() => {
//       alert("Terjadi kesalahan di server city");
//     });
//   }

//   fetchProvince = ()=>{
//     service.get(`/provinces/get`)
//     .then((result)=>{
//       this.setState({provinceList:result.data})
//     }).catch(() => {
//       alert("Terjadi kesalahan di server province");
//     });
//   }


//   addNewAddress = () => {
//     service.post(`/addresses/post`, {
//       address_detail: this.state.addAddressDetail,
//       cityId: parseInt(this.state.addCity),
//       provinceId: parseInt(this.state.addProvince),
//     })
//       .then(() => {
//         this.fetchAddress()
//         this.setState({
//           addAddressDetail: "",
//           addCity: "",
//           addProvince: "",
//         })
//       })
//       .catch(() => {
//         alert("Terjadi Kesalahan di Server")
//       })
//   }
  
//   inputHandler = (event: { target: { name: any; value: any } }) => {
//     const { name, value } = event.target

//     this.setState({ [name]: value });
//   }


//   renderAddress = ()=>{
//     return (
//       <div className="p-5">
//         <div className="flex justify-center">
//           <div className="text-center shadow-md"  >
//             <h1 className="text-2xl mt-3">Manage Product</h1>
//             <table className="table-auto mt-4 mx-auto ">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="px-4 py-2 ">ID</th>
//                   <th className="px-4 py-2">Name</th>
//                   <th className="px-4 py-2">Price</th>
//                   <th className="px-4 py-2">Image</th>
//                   <th className="px-4 py-2">Description</th>
//                   <th className="px-4 py-2">Category</th>
//                   {/* <th colSpan="2" className="px-4 py-2">Action</th> */}
//                 </tr>
//               </thead>
//               <tbody>{this.renderAddress()}</tbody>
//               <tfoot className="bg-gray-200 border border-grey">
//                 <tr>
//                   <td></td>
//                   <td>
//                     <input value={this.state.addAddressDetail} onChange={this.inputHandler} name="addAddressDetail" type="text" className="mt-1 block w-full rounded-md bg-gray-100 border border-gray-300 shadow-sm" />
//                   </td>
//                   <td>
//                     <select value={this.state.addCity} onChange={this.inputHandler} name="addCity" className="form-control">
//                       <option value="">City</option>
//                       {this.state.cityList.map((cities) => (
//                         <option key={cities.id} value={cities.id}>
//                           {cities.city}
//                         </option>
//                       ))}
//                     </select>

//                   </td>
//                   <td>
//                     <button onClick={this.addNewAddress} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2">Add Product</button>
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         </div>
//       </div>

      


//     );
//   }

  
// }

// export default (Dashboard);
