import { OrderDetails } from './orderDetails.interface';

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
  orderDetails?: OrderDetails[];
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
  to: Date;
  from: Date;
}
