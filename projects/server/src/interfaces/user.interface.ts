import { CartModel } from '@/models/cart.model';
import { Role, Status } from '.';

export interface User {
  id?: number;
  cartId?: number;
  warehouseId?: number;
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
}
