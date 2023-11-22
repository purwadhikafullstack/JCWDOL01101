export interface User {
  id?: number;
  warehouseId?: number;
  addressId?: number;
  externalId: string;
  role: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  imageUrl: string;
  status: string;
}

export interface GetFilterUser {
  page: number;
  s: string;
  r: string;
  order: string;
  filter: string;
}
