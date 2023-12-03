import { Product } from "@/hooks/useProduct"
import React from "react"

export interface User {
  id: number
  warehouseId?: number
  addressId?: number
  role: string
  externalId: string
  username: string
  firstname: string
  lastname: string
  email: string
  imageUrl: string
  status: string
  createdAt: Date
  updatedAt: Date
  userCart: Cart
}

export interface Cart {
  id: number
  userId: number
  createdAt: Date
  updatedAt: Date
  cartProducts: cartProducts[]
}

export interface cartProducts {
  id: number
  cartId: number
  productId: number
  quantity: number
  product: Product
}

export interface WarehouseAddress  {
  id: number;
  addressDetail: string;
  cityId: string;
  provinceId: number;
  cityData?: City[];
};


export interface Warehouse  {
  id: number;
  name: string;
  capacity: number;
  addressId: number;
  userId: number;
  warehouseAddress?: WarehouseAddress[];
};


export interface City  {
  cityId: string;
  cityName: string;
  provinceId: string;
  postal_code: number;
  provinceData?: Province[];
};


export interface Province  {
  provinceId: string;
  province: string;
};

export interface UserWithWarehouse extends User {
  warehouse?: Warehouse;
}

interface UserContextProps {
  user: User | undefined;
}

const UserContext = React.createContext<UserContextProps | undefined>(undefined);

export default UserContext;
