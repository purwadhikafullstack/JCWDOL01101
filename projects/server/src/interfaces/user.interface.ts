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
