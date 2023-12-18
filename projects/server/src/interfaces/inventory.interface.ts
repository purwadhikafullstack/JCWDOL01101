import { Status } from '.';

export interface Inventory {
  id?: number;
  warehouseId?: number;
  productId?: number;
  sizeId?: number;
  stock: number;
  sold: number;
  status: Status;
}

export interface AddStock {
  senderWarehouseId: number;
  receiverWarehouseId: number;
  productId: number;
  stock: number;
}
