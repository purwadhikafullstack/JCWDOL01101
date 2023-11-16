export interface User {
  id?: number;
  warehouseId?: number;
  addressId?: number;
  role: string;
  externalId: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  imageUrl: string;
  status: string;
}
