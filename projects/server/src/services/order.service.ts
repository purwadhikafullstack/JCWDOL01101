import { Warehouse } from '@/interfaces/warehouse.interface';
import { Location, findClosestWarehouse } from '@/utils/closestWarehouse';
import { Service } from 'typedi';

@Service()
export class OrderService {
  public async findClosestWarehouseWithStock(targetLocation: Location): Promise<Warehouse | null> {
    const closestWarehouse: Warehouse = await findClosestWarehouse(targetLocation);
    return closestWarehouse;
  }
}
