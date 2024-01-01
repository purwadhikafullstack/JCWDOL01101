import { Product } from "../useProduct";

export interface OrderDetails {
  orderId: number;
  productId: number;
  totalQuantity: number;
  product: Product;
}
