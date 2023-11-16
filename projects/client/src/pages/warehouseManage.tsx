import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const App = () => {
 const [warehouses, setWarehouses] = useState([]);
 const [name, setName] = useState('');
 const [capacity, setCapacity] = useState('');

//  const handleSubmit = (e) => {
//     e.preventDefault();
//     setWarehouses([...warehouses, { name, capacity }]);
//     setName('');
//     setCapacity('');
//  };

//  const handleDelete = (index) => {
//     let newWarehouses = [...warehouses];
//     newWarehouses.splice(index, 1);
//     setWarehouses(newWarehouses);
//  };

 return (
    <div className="container mx-auto">
      <h1 className="text-3xl mb-5">Warehouse Management</h1>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type=" text"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Capacity
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type=" text"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Inventory
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type=" text"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Admin
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type=" text"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Warehouse
        </button>
        
      </form>
      <div className="mt-8">
        <h2 className="text-2xl mb-5">Warehouses</h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Capacity</th>
              <th className="border px-4 py-2">Inventory</th>
              <th className="border px-4 py-2">Admin</th>
              <th className="border px-4 py-2">Actions</th>

            </tr>
          </thead>
          <tbody>
            {/* {warehouses.map((warehouse, index) => ( */}
              <tr>
                <td className="border px-4 py-2">name</td>
                <td className="border px-4 py-2">Jl. Merdeka x Nomor X</td>
                <td className="border px-4 py-2">200</td>
                <td className="border px-4 py-2">5</td>
                <td className="border px-4 py-2">Evelio</td>
                <td className="border px-4 py-2">
                 <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    // onClick={() => handleDelete(index)}
                 >
                    Delete
                 </button>
                </td>
              </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>
    </div>
 );
};

export default App;