import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Inventory } from '@/interfaces/inventory.interface';
import opencage from 'opencage-api-client';
import { Service } from 'typedi';

@Service()
export class InventoryService {
    public async findAllInventory(): Promise<Inventory[]> {
        const allInventory: Inventory[] = await DB.Inventories.findAll();
        return allInventory;
    }

    public async findInventoryById(inventoryId: number): Promise<Inventory> {
        const findInventory: Inventory = await DB.Inventories.findByPk(inventoryId);
        if (!findInventory) throw new HttpException(409, "Inventory doesn't exist");

        return findInventory;
    }

    public async createInventory(inventoryData: Inventory): Promise<Inventory> {
        const createInventoryData: Inventory = await DB.Inventories.create({ ...inventoryData });
        return createInventoryData;
    }

    public async updateInventory(inventoryId: number, inventoryData: Inventory): Promise<Inventory> {
        const findInventory: Inventory = await DB.Inventories.findByPk(inventoryId);
        if (!findInventory) throw new HttpException(409, "Inventory doesn't exist");

        await DB.Inventories.update({ ...inventoryData }, { where: { id: inventoryId } });
        const updateInventory: Inventory = await DB.Inventories.findByPk(inventoryId);
        return updateInventory;
    }

    public async deleteInventory(inventoryId: number): Promise<Inventory> {
        const findInventory: Inventory = await DB.Inventories.findByPk(inventoryId);
        if (!findInventory) throw new HttpException(409, "Inventory doesn't exist");

        await DB.Inventories.destroy({ where: { id: inventoryId } });

        return findInventory;
    }

    public async addStock(productId: number, warehouseId: number, stock: number): Promise<Inventory> {
        // Temukan entri inventory yang sesuai
        const inventory = await DB.Inventories.findOne({
          where: {
            productId: productId,
            warehouseId: warehouseId
          }
        });
      
        // klo ga ada
        if (!inventory) throw new HttpException(409, "Inventory doesn't exist");
      
        // Tambahkan stok ke entri inventaris yang ada
        inventory.stock = stock; // klo mo increment pake +=
      
        // Simpan perubahan ke database
        await inventory.save();
      
        return inventory;
      };

      public async getStockByWarehouseAndProduct(warehouseId: number, productId: number): Promise<Inventory> {
        const inventoryItem = await DB.Inventories.findOne({
          where: {
            warehouseId: warehouseId,
            productId: productId
          }
        });
      
        if (!inventoryItem) throw new HttpException(404, "Inventory item not found");
      
        return inventoryItem;
      }
      
}
