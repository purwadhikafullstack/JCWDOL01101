export interface GetFilterUser {
  page: number;
  s: string;
  r: string;
  order: string;
  filter: string;
}
import { CartModel } from '@/models/cart.model';
import { Role, Status, Warehouse } from '.';

export interface User {
  id?: number;
  cartId?: number;
  addressId?: number;
  role: Role;
  externalId: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  imageUrl: string;
  status: Status;
  userCart?: CartModel;
  userData?: Warehouse;
}
