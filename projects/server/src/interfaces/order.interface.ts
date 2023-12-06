export interface Order {
  id?: number;
  warehouseId?: number;
  userId?: number;
  invoice: string;
  status: string;
  deletedAt: Date;
}
