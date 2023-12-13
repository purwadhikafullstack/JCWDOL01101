import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { AddStock, Inventory } from '@/interfaces/inventory.interface';
import { Service } from 'typedi';
import { Op, Sequelize } from 'sequelize';
import { WarehouseModel } from '@/models/warehouse.model';

@Service()
export class InventoryService {
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

  public async addStock({ productId, stock, senderWarehouseId, receiverWarehouseId }: AddStock) {
    const transaction = await DB.sequelize.transaction();
    try {
      const findSenderWarehouse = await DB.Inventories.findOne({ where: { warehouseId: senderWarehouseId, productId }, transaction });
      const findReceiverWarehouse = await DB.Inventories.findOne({ where: { warehouseId: receiverWarehouseId, productId }, transaction });
      if (!findSenderWarehouse && !findReceiverWarehouse) {
        throw new HttpException(409, 'Warehouse Not Found');
      }
      if (findReceiverWarehouse.stock - stock <= 20) {
        throw new HttpException(409, 'When accepting stock, stock must be over 20');
      }
      await DB.Inventories.update(
        { stock: Sequelize.literal(`stock - ${stock}`) },
        { where: { warehouseId: receiverWarehouseId, productId }, transaction },
      );
      await DB.Inventories.update(
        { stock: Sequelize.literal(`stock + ${stock}`) },
        { where: { warehouseId: senderWarehouseId, productId }, transaction },
      );
      await transaction.commit();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
    }
  }
}
