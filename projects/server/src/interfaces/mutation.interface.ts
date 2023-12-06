export interface Mutation {
  id?: number;
  senderWarehouseId?: number;
  receiverWarehouseId?: number;
  senderName: string;
  receiverName?: string;
  productId?: number;
  quantity: number;
  notes?: string;
  status: 'ONGOING' | 'COMPLETED' | 'REJECTED' | 'CANCELED';
  createdAt?: Date;
  updatedAt?: Date;
}
