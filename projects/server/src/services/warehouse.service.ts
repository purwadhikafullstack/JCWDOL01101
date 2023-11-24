import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Warehouse } from '@/interfaces/warehouse.interface';
import { Service } from 'typedi';

@Service()
export class WarehouseService {
    public async findAllWarehouse():Promise<Warehouse[]> {
      const allWarehouse: Warehouse[] = await DB.Warehouses.findAll({
        include: [{
          model: DB.Addresses,
          as: 'address',
          attributes: ['addressDetail'],
          include: [{
            model: DB.Cities,
            as: 'cityData',
            attributes: ['city'],
            include: [{
              model: DB.Provinces,
              as: 'provinceData',
              attributes: ['province']
            }]
          }]
        }]
      });
      
        return allWarehouse;
    }

    public async findWarehouseById(warehouseId: number): Promise<Warehouse> {
        const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
        if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");
    
        return findWarehouse;
      }

    public async createWarehouse(warehouseData:Warehouse):Promise<Warehouse>{
        const findWarehouse: Warehouse=await DB.Warehouses.findOne({where:{name:warehouseData.name}})
        if (findWarehouse) throw new HttpException(409, 'Warehouse already exist');

        const createWarehouseData:Warehouse= await DB.Warehouses.create({...warehouseData});
        await DB.Inventories.create({
          stock:0,
        })
        return createWarehouseData;
    }

    public async updateWarehouse(warehouseId: number, warehouseData: Warehouse): Promise<Warehouse> {
        const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
        if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");
    

        await DB.Warehouses.update({ ...warehouseData}, { where: { id: warehouseId } });
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
