import { Product } from './product.interface';

export interface Category {
  id?: number;
  name: string;
  slug: string;
  image: string;
  deletedAt: Date | null;
  productCategory?: Product | null;
}

export interface TopCategory {
  title: string;
  total: number;
}
