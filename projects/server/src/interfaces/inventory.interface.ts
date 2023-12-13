export interface Inventory {
  id?: number;
  warehouseId: number;
  productId: number;
  stock: number;
  sold: number;
  totalStock?: number;
}
