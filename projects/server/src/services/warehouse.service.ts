import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Product } from '@/interfaces/product.interface';
import { Warehouse } from '@/interfaces/warehouse.interface';
import { Location, findClosestWarehouse } from '@/utils/closestWarehouse';
import { Service } from 'typedi';

@Service()
export class WarehouseService {
  public async findAllWarehouse(): Promise<Warehouse[]> {
    const allWarehouse: Warehouse[] = await DB.Warehouses.findAll({
      order: [['name', 'ASC']],
      include: [
        {
          model: DB.WarehouseAddresses,
          as: 'warehouseAddress',
          attributes: ['addressDetail'],
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
          model: DB.User,
          as: 'warehouse',
          attributes: ['username'],
        },
      ],
    });

    return allWarehouse;
  }

  public async findClosestWarehouse(targetLocation: Location): Promise<Warehouse | null> {
    const closestWarehouse = findClosestWarehouse(targetLocation);
    if (!closestWarehouse) throw new HttpException(409, 'No Warehouse found');

    return closestWarehouse;
  }

  public async findWarehouseById(warehouseId: number): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId, {
      include: [
        {
          model: DB.WarehouseAddresses,
          as: 'warehouseAddress',
          attributes: ['addressDetail'],
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
      ],
    });
    if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");

    return findWarehouse;
  }

  public async findWarehouseByUserId(userId: number): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findOne({ where: { userId: userId } });
    if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");

    return findWarehouse;
  }

  public async findWarehouseByName(name: string): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findOne({ where: { name } });
    if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");

    return findWarehouse;
  }

  public async createWarehouse(warehouseData: Warehouse): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findOne({ where: { name: warehouseData.name } });
    if (findWarehouse) throw new HttpException(409, 'Warehouse already exist');

    const createWarehouseData: Warehouse = await DB.Warehouses.create({ ...warehouseData });
    const findProduct: Product[] = await DB.Product.findAll({
      where: {
        status: 'ACTIVE',
      },
    });

    if (findProduct && findProduct.length > 0) {
      const productIds = findProduct.map(p => p.id);
      const inventory = await DB.Inventories.findAll({ where: { productId: productIds } });
      const uniqueSizeIds = new Set();

      const uniqueInventory = inventory.filter(inv => {
        if (!uniqueSizeIds.has(inv.sizeId)) {
          uniqueSizeIds.add(inv.sizeId);
          return true;
        }
        return false;
      });
      const inventoryData = uniqueInventory.map(inv => ({ warehouseId: createWarehouseData.id, productId: inv.productId, sizeId: inv.sizeId }));
      await DB.Inventories.bulkCreate(inventoryData);
    }
    return createWarehouseData;
  }

  public async updateWarehouse(warehouseId: number, warehouseData: Warehouse): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
    if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");

    await DB.Warehouses.update({ ...warehouseData }, { where: { id: warehouseId } });
    const updateWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
    return updateWarehouse;
  }

  public async deleteWarehouse(warehouseId: number): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
    if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");

    await DB.Warehouses.destroy({ where: { id: warehouseId } });

    return findWarehouse;
  }

  public async assignAdmin(warehouseId: number, userId: number): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
    if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");

    await DB.Warehouses.update({ userId }, { where: { id: warehouseId } });
    const updatedWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
    return updatedWarehouse;
  }

  public async unassignAdmin(userId: number): Promise<void> {
    await DB.Warehouses.update({ userId: null }, { where: { userId } });
  }
}
