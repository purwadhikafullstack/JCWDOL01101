export interface OrderDetails {
  id?: number;
  orderId?: number;
  sizeId: number;
  productId?: number;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
