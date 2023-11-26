export interface Order {
  id?: number;
  userId: number;
  payment: string;
  deletedAt: Date;
}
