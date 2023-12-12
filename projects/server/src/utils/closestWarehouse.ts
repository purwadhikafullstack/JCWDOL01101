import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { CartProduct } from '@/interfaces/cartProduct.interface';
import { Warehouse } from '@/interfaces/warehouse.interface';
import { InventoryModel } from '@/models/inventory.model';
import { WarehouseAddressModel } from '@/models/warehouseAddress.model';
export interface Location {
  lat: number;
  lng: number;
}

async function getAllWarehouse(): Promise<Warehouse[]> {
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
        attributes: ['id', 'stock', 'sold'],
      },
    ],
  });

  return warehouses;
}

export async function findClosestWarehouse(targetLocation: Location): Promise<Warehouse | null> {
  let minDistance = Infinity;
  const warehouses = await getAllWarehouse();
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
async function getClosestWarehouses(warehouse: Warehouse): Promise<Warehouse[]> {
  const { latitude: targetLat, longitude: targetLng } = warehouse.warehouseAddress;
  const warehouses = await getAllWarehouse();
  const distances = warehouses.map(warehouse => {
    const { latitude, longitude } = warehouse.warehouseAddress;
    const distance = haversine(targetLat, targetLng, latitude, longitude);
    return { warehouse, distance };
  });

  distances.sort((a, b) => a.distance - b.distance);
  return distances.map(d => d.warehouse);
}

export async function findWarehousesAndDistributeStock(cartProducts: CartProduct[], currentWarehouse: Warehouse) {
  const transaction = await DB.sequelize.transaction();
  try {
    for (const cartProduct of cartProducts) {
      let remainingQuantity = cartProduct.quantity;
      const closestWarehouses = await getClosestWarehouses(currentWarehouse);
      const currentInventory = await DB.Inventories.findOne({
        where: { productId: cartProduct.productId, warehouseId: currentWarehouse.id },
      });

      for (const warehouse of closestWarehouses) {
        if (warehouse.id === currentWarehouse.id) continue;
        const inventory = await DB.Inventories.findOne({
          where: { productId: cartProduct.productId, warehouseId: warehouse.id },
        });
        if (!inventory || inventory.stock === 0) continue;
        const transferQuantity = Math.min(inventory.stock, remainingQuantity);
        if (transferQuantity > 0) {
          inventory.stock -= transferQuantity;
          currentInventory.stock += transferQuantity;
          remainingQuantity -= transferQuantity;

          await Promise.all([
            inventory.save(),
            currentInventory.save(),
            DB.Jurnal.create({
              warehouseId: inventory.warehouseId,
              inventoryId: inventory.id,
              oldQty: inventory.stock + transferQuantity,
              qtyChange: transferQuantity,
              newQty: inventory.stock,
              type: 'STOCK OUT',
              date: new Date(),
            }),
            DB.Jurnal.create({
              warehouseId: currentWarehouse.id,
              inventoryId: currentInventory.id,
              oldQty: currentInventory.stock - transferQuantity,
              qtyChange: transferQuantity,
              newQty: currentInventory.stock,
              type: 'STOCK IN',
              date: new Date(),
            }),
          ]);
        }
        if (remainingQuantity === 0) break;
      }
      if (remainingQuantity > 0) {
        await DB.CartProduct.update({ status: 'DELETED' }, { where: { id: cartProduct.id } });
        throw new HttpException(409, `Not enough stock for product ${cartProduct.productId}`);
      }
    }
    await transaction.commit();
    const updatedCurrentWarehouse: Warehouse = await DB.Warehouses.findOne({
      where: { id: currentWarehouse.id },
      include: [
        {
          model: InventoryModel,
          as: 'inventories',
        },
      ],
    });
    return updatedCurrentWarehouse;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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
