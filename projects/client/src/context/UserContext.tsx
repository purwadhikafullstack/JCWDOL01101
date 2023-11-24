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

export interface City {
  id: number
  provinceId: number
  city: string
  postalCode: number
}

export interface Province {
  id: number
  province: string
}

export interface Address {
  id: number
  cityId: number
  userId?: number
  latitude?: string
  longitude?: string
  addressDetail?: string
  isPrimary: boolean
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

interface UserContextProps {
  user: User | undefined
}

const UserContext = React.createContext<UserContextProps | undefined>(undefined)

export default UserContext
