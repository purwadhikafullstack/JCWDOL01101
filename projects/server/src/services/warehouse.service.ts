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
          as: 'userData',
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
    const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
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
    const products: Product[] = await DB.Product.findAll({
      where: {
        status: 'ACTIVE',
      },
    });
    if (products.length > 0) {
      const product = products.map(product => ({ warehouseId: createWarehouseData.id, productId: product.id }));
      await DB.Inventories.bulkCreate(product);
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
}
