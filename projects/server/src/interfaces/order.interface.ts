export interface Order {
  id?: number;
  warehouseId?: number;
  totalPrice: number;
  shippingFee: number;
  userId?: number;
  invoice: string;
  status: string;
  deletedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetFilterOrder {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
  externalId: string;
  warehouse: string;
  status: string | string[];
}
