export interface Mutation {
  id?: number;
  senderWarehouseId?: number;
  receiverWarehouseId?: number;
  senderName: string;
  receiverName?: string;
  productId?: number;
  sizeId: number;
  quantity: number;
  senderNotes?: string;
  receiverNotes?: string;
  status: 'ONGOING' | 'COMPLETED' | 'REJECTED' | 'CANCELED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetFilterMutation {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
  externalId: string;
  warehouse: string;
  manage: string;
}
