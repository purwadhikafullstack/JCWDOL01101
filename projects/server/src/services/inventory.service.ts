import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { AddStock, Inventory } from '@/interfaces/inventory.interface';
import Container, { Service } from 'typedi';
import { Op } from 'sequelize';
import { WarehouseModel } from '@/models/warehouse.model';
import { JurnalService } from './jurnal.service';

@Service()
export class InventoryService {
  jurnal = Container.get(JurnalService);

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

  public async addStock(productId: number, sizeId: number, warehouseId: number, stock: number, notes: string): Promise<Inventory> {
    const inventory = await DB.Inventories.findOne({
      where: {
        sizeId,
        productId,
        warehouseId,
      },
    });
    if (!inventory) throw new HttpException(409, "Inventory doesn't exist");
    const isInventoryUpdate = await DB.Inventories.update({ stock: stock }, { where: { id: inventory.id } });
    if (isInventoryUpdate) {
      await DB.Jurnal.create({ inventoryId: inventory.id, oldQty: inventory.stock, qtyChange: stock, newQty: stock, notes, type: '1' });
    }
    return inventory;
  }

  public async getStockByWarehouseAndProduct(warehouseId: number, productId: number): Promise<Inventory> {
    const inventoryItem = await DB.Inventories.findOne({
      where: {
        warehouseId: warehouseId,
        productId: productId,
      },
    });

    if (!inventoryItem) throw new HttpException(404, 'Inventory item not found');

    return inventoryItem;
  }

  public async getWarehouseByInventoryProduct(productId: number, warehouseId: number): Promise<Inventory[]> {
    if (isNaN(productId) || isNaN(warehouseId)) {
      throw new HttpException(400, 'Invalid productId or warehouseId');
    }

    const warehouse = await DB.Inventories.findAll({ where: { productId } });
    if (!warehouse) throw new HttpException(409, 'No Stock Available');

    const findWarehouses = await DB.Inventories.findAll({
      where: {
        productId,
        warehouseId: {
          [Op.ne]: warehouseId,
        },
        stock: {
          [Op.gte]: 20,
        },
      },
      order: [['stock', 'DESC']],
      include: {
        model: WarehouseModel,
        as: 'warehouse',
      },
    });
    return findWarehouses;
  }

  public async exchangeStock({ productId, stock, senderWarehouseId, receiverWarehouseId }: AddStock) {
    const transaction = await DB.sequelize.transaction();
    try {
      const findSenderInventory: Inventory = await DB.Inventories.findOne({ where: { warehouseId: senderWarehouseId, productId }, transaction });
      const findReceiverInventory: Inventory = await DB.Inventories.findOne({ where: { warehouseId: receiverWarehouseId, productId }, transaction });
      if (!findSenderInventory && !findReceiverInventory) {
        throw new HttpException(409, 'Warehouse Not Found');
      }
      if (findReceiverInventory.stock - stock <= 20) {
        throw new HttpException(409, `When accepting stock, stock must be over 20, stock left : ${findReceiverInventory.stock}`);
      }
      const stockChangeSender = findSenderInventory.stock + stock;
      const stockChangeReceiver = findReceiverInventory.stock - stock;
      await DB.Inventories.update({ stock: stockChangeReceiver }, { where: { id: findReceiverInventory.id }, transaction });
      await DB.Inventories.update({ stock: stockChangeSender }, { where: { id: findSenderInventory.id }, transaction });

      const jurnalData = { findSenderInventory, findReceiverInventory, stock, stockChangeSender, stockChangeReceiver };
      await this.jurnal.jurnalExchangeStock(jurnalData, transaction);

      await transaction.commit();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      throw new HttpException(409, err.message);
    }
  }
}
