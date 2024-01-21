import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Warehouse } from '@/interfaces/warehouse.interface';
import { Location, findClosestWarehouse } from '@/utils/closestWarehouse';
import { Service } from 'typedi'

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
    const transaction = await DB.sequelize.transaction();
    try {
      const { name } = warehouseData;
      const warehouse = await DB.Warehouses.findOne({ where: { name }, attributes: ['id'],transaction });
      if (warehouse) throw new HttpException(409, 'Warehouse already exists');
      const previousWarehouse = await DB.Warehouses.findOne({ order: [['createdAt', 'DESC']], attributes: ['id'],transaction });
      const createWarehouseData: Warehouse = await DB.Warehouses.create({ ...warehouseData },{transaction});
      if (previousWarehouse) {
        const existingInventory = await DB.Inventories.findAll({ where: { warehouseId: previousWarehouse.id },  transaction  });
        const inventoryData = existingInventory.map(inv => ({ warehouseId: createWarehouseData.id, productId: inv.productId, sizeId: inv.sizeId }));
        if (inventoryData.length > 0) {
          await DB.Inventories.bulkCreate(inventoryData, { transaction });
        }
      }
      await transaction.commit();
      return createWarehouseData;
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(500, 'Something went wrong');
    }
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
