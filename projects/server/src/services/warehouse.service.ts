import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Warehouse } from '@/interfaces/warehouse.interface';
import { Service } from 'typedi';

@Service()
export class WarehouseService {
  public async findAllWarehouse(): Promise<Warehouse[]> {
    const allWarehouse: Warehouse[] = await DB.Warehouses.findAll({
      include: [
        {
          model: DB.WarehouseAddresses,
          as: 'warehouseAddress',
          attributes: ['addressDetail'],
          include: [
            {
              model: DB.City,
              as: 'cityData',
              attributes: ['cityName'],
              include: [
                {
                  model: DB.Province,
                  as: 'provinceData',
                  attributes: ['province'],
                },
              ],
            },
          ],
        },
        {
          model: DB.User,
          as: 'userData',
          attributes: ['username'],
        },
      ],
    });

    return allWarehouse;
  }

  public async findWarehouseById(warehouseId: number): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
    if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");

    return findWarehouse;
  }

  public async createWarehouse(warehouseData: Warehouse): Promise<Warehouse> {
    const findWarehouse: Warehouse = await DB.Warehouses.findOne({ where: { name: warehouseData.name } });
    if (findWarehouse) throw new HttpException(409, 'Warehouse already exist');

    const createWarehouseData: Warehouse = await DB.Warehouses.create({ ...warehouseData });
    await DB.Inventories.create({
      stock: 0,
    });
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
