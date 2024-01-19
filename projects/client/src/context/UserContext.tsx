import React from "react";

import { Size } from "@/hooks/useSize";
import { Product } from "@/hooks/useProduct";
import { Warehouse } from "@/hooks/useWarehouse";

export interface User {
  id: number;
  warehouseId?: number;
  addressId?: number;
  role: string;
  externalId: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  imageUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userCart: Cart;
  warehouse: Warehouse;
}

export interface Cart {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  cartProducts: cartProducts[];
}

export interface cartProducts {
  id: number;
  cartId: number;
  sizeId: number;
  productId: number;
  quantity: number;
  selected: boolean;
  product: Product;
  size: Size;
}
interface UserContextProps {
  user: User | undefined;
}

export const UserContext = React.createContext<UserContextProps | undefined>(
  undefined
);

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
