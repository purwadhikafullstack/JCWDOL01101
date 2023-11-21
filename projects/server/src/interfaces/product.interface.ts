export interface Product {
  id?: number;
  categoryId?: number;
  name: string;
  price: number;
  stock: number;
  sold: number;
  image: string;
  weight: number;
  description: string;
  status: string;
}

export interface GetFilterProduct {
  page: number;
  s: string;
  filter: string;
  order: string;
}
