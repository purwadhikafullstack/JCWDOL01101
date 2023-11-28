export interface Jurnal {
  id?: number;
  inventoryId?: number;
  quantity: number;
  type: 'ADD' | 'REMOVE';
  date: Date;
  notes?: string;
}
