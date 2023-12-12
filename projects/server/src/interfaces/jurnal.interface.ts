export interface Jurnal {
  id?: number;
  warehouseId?: number;
  inventoryId?: number;
  oldQty: number;
  qtyChange: number;
  newQty: number;
  type: 'STOCK IN' | 'STOCK OUT';
  date: Date;
  notes?: string;
}
