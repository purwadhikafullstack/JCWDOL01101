import { Status } from '.';

export interface CartProduct {
  id?: number;
  cartId: number;
  sizeId: number;
  productId: number;
  quantity: number;
  status: Status;
  price: number;
  selected: boolean;
}
