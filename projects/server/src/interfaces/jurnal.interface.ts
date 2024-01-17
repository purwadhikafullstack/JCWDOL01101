import { Inventory } from './inventory.interface';

export interface Jurnal {
  id?: number;
  inventoryId?: number;
  oldQty: number;
  qtyChange: number;
  newQty: number;
  type: '1' | '0';
  notes?: string;
  createdAt?:Date;
}

export interface JurnalData {
  findSenderInventory: Inventory;
  findReceiverInventory: Inventory;
  stock: number;
  stockChangeSender: number;
  stockChangeReceiver: number;
}

export interface GetFilterJurnal {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
  externalId: string;
  warehouse: string;
  to:Date;
  from:Date;
}