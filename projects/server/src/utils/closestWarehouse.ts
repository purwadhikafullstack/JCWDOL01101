import { DB } from '@/database';
import { Warehouse } from '@/interfaces/warehouse.interface';
import { InventoryModel } from '@/models/inventory.model';
import { WarehouseAddressModel } from '@/models/warehouseAddress.model';
import { Op } from 'sequelize';
export interface Location {
  lat: number;
  lng: number;
}

export async function findClosestWarehouse(targetLocation: Location): Promise<Warehouse | null> {
  const warehouses: Warehouse[] = await DB.Warehouses.findAll({
    include: [
      {
        model: WarehouseAddressModel,
        as: 'warehouseAddress',
        attributes: ['latitude', 'longitude', 'cityId'],
        include: [
          {
            model: DB.City,
            as: 'cityWarehouse',
            attributes: ['cityName'],
            include: [
              {
                model: DB.Province,
                as: 'cityProvince',
                attributes: ['province'],
              },
            ],
          },
        ],
      },
      {
        model: InventoryModel,
        as: 'inventories',
        attributes: ['stock', 'sold'],
        where: {
          stock: {
            [Op.gt]: 0,
          },
        },
      },
    ],
  });
  let minDistance = Infinity;
  let closestWarehouse: Warehouse | null = null;
  for (const warehouse of warehouses) {
    const { latitude, longitude } = warehouse.warehouseAddress;
    const distance = haversine(targetLocation.lat, targetLocation.lng, latitude, longitude);
    if (distance < minDistance) {
      minDistance = distance;
      closestWarehouse = warehouse;
    }
  }
  return closestWarehouse;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371.0;
  const toRadians = (angle: number) => (angle * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}
