export interface Inventory {
  id?: number;
  warehouseId: number;
  productId: number;
  stock: number;
  sold: number;
}

export interface AddStock {
  senderWarehouseId: number;
  receiverWarehouseId: number;
  productId: number;
  stock: number;
}
