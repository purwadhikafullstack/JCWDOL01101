import { Category, Inventory, Status } from '.';

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
  averageRating?: number;
  inventory?: Inventory[];
  productCategory?: Category;
}
