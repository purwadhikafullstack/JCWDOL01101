export interface Order {
  id?: number;
  warehouseId?: number;
  totalPrice: number;
  shippingFee: number;
  userId?: number;
  invoice: string;
  status: string;
  deletedAt: Date;
}
