import { Inventory } from './inventory.interface';

export interface Jurnal {
  id?: number;
  inventoryId?: number;
  oldQty: number;
  qtyChange: number;
  newQty: number;
  type: 'STOCK IN' | 'STOCK OUT';
  date: Date;
  notes?: string;
}

export interface JurnalData {
  findSenderInventory: Inventory;
  findReceiverInventory: Inventory;
  stock: number;
  stockChangeSender: number;
  stockChangeReceiver: number;
}
