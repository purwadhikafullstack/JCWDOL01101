import { Product } from "@/hooks/useProduct"
import { Warehouse } from "@/hooks/useWarehouse"
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
  userData: Warehouse
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
  selected: boolean
  product: Product
}
interface UserContextProps {
  user: User | undefined
}

const UserContext = React.createContext<UserContextProps | undefined>(undefined)

export default UserContext
