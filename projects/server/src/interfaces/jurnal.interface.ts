import { Inventory } from './inventory.interface';

export interface Jurnal {
  id?: number;
  inventoryId?: number;
  oldQty: number;
  qtyChange: number;
  newQty: number;
  type: '1' | '0';
  notes?: string;
}

export interface JurnalData {
  findSenderInventory: Inventory;
  findReceiverInventory: Inventory;
  stock: number;
  stockChangeSender: number;
  stockChangeReceiver: number;
}
