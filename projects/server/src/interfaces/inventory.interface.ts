export interface Inventory {
  id?: number;
  warehouseId?: number;
  productId?: number;
  sizeId?: number;
  stock: number;
  sold: number;
  totalStock?: number;
}

export interface AddStock {
  senderWarehouseId: number;
  receiverWarehouseId: number;
  productId: number;
  stock: number;
}
