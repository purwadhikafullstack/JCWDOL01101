import { Status } from '.';

export interface Inventory {
  id?: number;
  warehouseId?: number;
  productId?: number;
  sizeId?: number;
  stock: number;
  sold: number;
  status: Status;
  totalStock?: number;
}
