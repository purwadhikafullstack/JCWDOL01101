import React from "react";
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

const products = [
  {
    id: 1,
    category: "Men Clothings",
    name: "Black Shirt",
    price: 45000,
    stock: 10,
    sold: 3,
    imageUrl: "/placeholder/black-shirt.jpg",
    weight: 0.2,
  },
];

const Product = () => {
  return (
    <div className="flex flex-col p-2 w-full">
      <Button className="self-end">
        <Plus className="w-4 h-4 mr-2" /> New Product
      </Button>
      <div className="border rounded-md mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[100px] text-center">Weight</TableHead>
              <TableHead className="w-[100px] text-center">Stock</TableHead>
              <TableHead className="w-[100px] text-center">Sold</TableHead>
              <TableHead className="text-center">Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell className="text-center">{product.weight}</TableCell>
                <TableCell className="text-center">{product.stock}</TableCell>
                <TableCell className="text-center">{product.sold}</TableCell>
                <TableCell className="text-center">
                  <img
                    className="w-[40px] mx-auto"
                    src={product.imageUrl}
                    alt={product.name}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Product;
