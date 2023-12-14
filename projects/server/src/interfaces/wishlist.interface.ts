export interface Wishlist {
  id?: number;
  userId: number;
  productId: number;
  deletedAt: Date | null;
}
