import { Status } from '.';

export interface CartProduct {
  id?: number;
  cartId: number;
  productId: number;
  quantity: number;
  status: Status;
  price: number;
}
