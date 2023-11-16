import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Warehouse } from '@/interfaces/warehouses.interface';
import { Service } from 'typedi';

@Service()
export class WarehouseService {
    public async findAllWarehouse():Promise<Warehouse[]> {
        const allWarehouse: Warehouse[] = await DB.Warehouses.findAll();
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
        return createWarehouseData;
    }

    public async updateWarehouse(warehouseId: number, warehouseData: Warehouse): Promise<Warehouse> {
        const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
        if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");
    

        await DB.Warehouses.update({ ...warehouseData}, { where: { id: warehouseId } });
        const updateUser: Warehouse = await DB.Warehouses.findByPk(warehouseId);
        return updateUser;
      }
    
      public async deleteUser(warehouseId: number): Promise<Warehouse> {
        const findWarehouse: Warehouse = await DB.Warehouses.findByPk(warehouseId);
        if (!findWarehouse) throw new HttpException(409, "Warehouse doesn't exist");
    
        await DB.Warehouses.destroy({ where: { id: warehouseId } });
    
        return findWarehouse;
      }

}
