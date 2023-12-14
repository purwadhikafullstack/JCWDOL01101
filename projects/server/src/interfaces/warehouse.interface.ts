import { Inventory } from './inventory.interface';
import { WarehouseAddress } from './warehouseAddress.interface';

export interface Warehouse {
  id?: number;
  inventoryId?: number;
  warehouseAddressId?: number;
  userId?: number;
  name: string;
  capacity: number;
  warehouseAddress?: WarehouseAddress;
  inventories?: Inventory[];
}
