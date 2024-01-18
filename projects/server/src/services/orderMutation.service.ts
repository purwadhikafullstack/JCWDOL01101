import { DB } from '@/database';
import Container, { Service } from 'typedi';
import { Order } from '@/interfaces/order.interface';
import { User } from '@/interfaces/user.interface';
import { HttpException } from '@/exceptions/HttpException';
import { OrderDetailsModel } from '@/models/orderDetails.model';
import { OrderDetails, Warehouse } from '@/interfaces';
import { verifyStock } from '@/utils/closestWarehouse';
import { WarehouseService } from './warehouse.service';
import { InventoryService } from './inventory.service';

@Service()
export class OrderMutationService {
  warehouse = Container.get(WarehouseService);
  inventory = Container.get(InventoryService);

  public async adminAcceptOrder(orderId: number) {
    const findOrder: Order = await DB.Order.findByPk(orderId);
    if (!findOrder) throw new HttpException(409, "Order doesn't exist");
    if (findOrder.status !== 'WAITING') throw new HttpException(409, "Can't accept order");
    const currentWarehouse: Warehouse = await this.warehouse.findWarehouseById(findOrder.warehouseId);
    const orderDetails: OrderDetails[] = await DB.OrderDetails.findAll({ where: { orderId } });
    if (!orderDetails || orderDetails.length === 0) throw new HttpException(409, "Order doesn't exist");

    const transaction = await DB.sequelize.transaction();
    try {
      await verifyStock(orderDetails, currentWarehouse, transaction);
      await this.inventory.orderStock(findOrder, orderDetails, currentWarehouse, transaction);
      await DB.Order.update({ status: 'PROCESS' }, { where: { id: orderId }, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    const updatedOrder = await DB.Mutation.findByPk(orderId);
    return updatedOrder;
  }

  public async adminRejectOrder(orderId: number) {
    const findOrder: Order = await DB.Order.findByPk(orderId);
    if (!findOrder) throw new HttpException(409, "Order doesn't exist");
    if (findOrder.status !== 'WAITING') throw new HttpException(409, "Can't reject order");

    await DB.Order.update({ status: 'REJECTED' }, { where: { id: orderId } });
    const updatedOrder = await DB.Mutation.findByPk(orderId);
    return updatedOrder;
  }

  public async adminSendOrder(orderId: number) {
    const findOrder: Order = await DB.Order.findByPk(orderId);
    if (!findOrder) throw new HttpException(409, "Order doesn't exist");
    if (findOrder.status !== 'PROCESS') throw new HttpException(409, "Can't send order");

    await DB.Order.update({ status: 'DELIVERED' }, { where: { id: orderId } });
    const updatedOrder = await DB.Mutation.findByPk(orderId);
    return updatedOrder;
  }

  public async adminCancelOrder(orderId: number) {
    const findOrder: Order = await DB.Order.findByPk(orderId);
    if (!findOrder) throw new HttpException(409, "Order doesn't exist");
    if (findOrder.status !== 'PROCESS') throw new HttpException(409, "Can't cancel order");
    const currentWarehouse: Warehouse = await this.warehouse.findWarehouseById(findOrder.warehouseId);
    const orderDetails: OrderDetails[] = await DB.OrderDetails.findAll({ where: { orderId } });
    if (!orderDetails || orderDetails.length === 0) throw new HttpException(409, "Order doesn't exist");
    const transaction = await DB.sequelize.transaction();
    try {
      await this.inventory.returnOrderStock(findOrder, orderDetails, currentWarehouse, transaction);
      await DB.Order.update({ status: 'CANCELED' }, { where: { id: orderId }, transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    const updatedOrder = await DB.Mutation.findByPk(orderId);
    return updatedOrder;
  }

  public async allowOrder(externalId: string, productId: number): Promise<Order> {
    const findUser: User = await DB.User.findOne({ where: { externalId, status: 'ACTIVE' } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    const findOrder: Order = await DB.Order.findOne({
      where: {
        userId: findUser.id,
        status: 'DELIVERED',
      },
      include: [
        {
          model: OrderDetailsModel,
          as: 'orderDetails',
          where: {
            productId,
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return findOrder;
  }

  public async cancelOrder(orderId: number): Promise<Order> {
    const order = await DB.Order.findByPk(orderId);
    if (!order) throw new HttpException(404, 'Order not found');

    order.status = 'CANCELED';
    await order.save();

    return order;
  }

  public async confirmOrder(orderId: number): Promise<Order> {
    const order = await DB.Order.findByPk(orderId);
    if (!order) throw new HttpException(404, 'Order not found');

    order.status = 'SUCCESS';
    await order.save();

    return order;
  }
}
