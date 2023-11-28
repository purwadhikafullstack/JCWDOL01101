import { Status } from '.';

export interface Product {
  id?: number;
  categoryId?: number;
  cartId?: number;
  name: string;
  price: number;
  weight: number;
  description: string;
  status: Status;
  slug: string;
}

export interface GetFilterProduct {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
}
