import { Status } from '.';

export interface Product {
  id?: number;
  categoryId?: number;
  cartId?: number;
  name: string;
  price: number;
  weight: number;
  description: string;
  primaryImage: string;
  status: Status;
  slug: string;
  totalStock?: number;
  createdAt?: Date;
  updateAt?: Date;
}

export interface GetFilterProduct {
  s: string;
  size: string;
  page: number;
  status: string;
  filter: string;
  order: string;
  limit: number;
  externalId: string;
  warehouse: number;
  category: string;
}
