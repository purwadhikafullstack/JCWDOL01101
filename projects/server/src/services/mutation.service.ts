import { DB } from '@/database';
import { MutationDto } from '@/dtos/mutation.dto';
import { HttpException } from '@/exceptions/HttpException';
import { GetFilterMutation, Mutation } from '@/interfaces/mutation.interface';
import { User } from '@/interfaces/user.interface';
import { ProductModel } from '@/models/product.model';
import { FindOptions, Op } from 'sequelize';
import Container, { Service } from 'typedi';
import { WarehouseService } from './warehouse.service';
import { WarehouseModel } from '@/models/warehouse.model';
import { InventoryService } from './inventrory.service';

@Service()
export class MutationService {
  warehouse = Container.get(WarehouseService);
  inventory = Container.get(InventoryService);

  public async createMutation(mutationData: MutationDto): Promise<Mutation> {
    const product = await DB.Product.findOne({ where: { id: mutationData.productId } });
    if (!product) throw new HttpException(409, "Product doesn't exist");

    if (mutationData.quantity < 0) throw new HttpException(500, 'Quantity is empty');
    const productStock = await DB.Inventories.findOne({
      where: { warehouseId: mutationData.receiverWarehouseId, productId: mutationData.productId },
    });
    if (!productStock) throw new HttpException(409, 'No stock available');
    if (productStock.stock <= 20) throw new HttpException(409, 'Product stock not meet requirement');
    if (productStock.stock - mutationData.quantity <= 20) throw new HttpException(409, 'Product stock not meet requirement');
    const mutation = await DB.Mutation.create({ ...mutationData, senderNotes: mutationData.notes, status: 'ONGOING' });
    return mutation;
  }

  public async cancelMutation(mutationId: number) {
    const findMutation = await DB.Mutation.findOne({ where: { id: mutationId, status: 'ONGOING' } });
    if (!findMutation) throw new HttpException(409, 'Mutation has been canceled/completed');

    await DB.Mutation.update({ status: 'CANCELED' }, { where: { id: mutationId } });
    const updatedMutation = await DB.Mutation.findByPk(mutationId);
    return updatedMutation;
  }

  public async acceptMutation(mutationId: number, name: string, notes: string) {
    let updatedStock;
    try {
      const findMutation = await DB.Mutation.findOne({ where: { id: mutationId, status: 'ONGOING' } });
      if (!findMutation) throw new HttpException(409, 'Mutation has been canceled/completed');
      updatedStock = await this.inventory.exchangeStock({
        productId: findMutation.productId,
        stock: findMutation.quantity,
        senderWarehouseId: findMutation.senderWarehouseId,
        receiverWarehouseId: findMutation.receiverWarehouseId,
      });
      await DB.Mutation.update({ status: 'COMPLETED', receiverNotes: notes || 'Approved', receiverName: name }, { where: { id: mutationId } });
    } catch (err) {
      throw new HttpException(409, err.message);
    }
    return updatedStock;
  }

  public async rejectMutation(mutationId: number, name: string, notes: string) {
    const findMutation = await DB.Mutation.findOne({ where: { id: mutationId, status: 'ONGOING' } });
    if (!findMutation) throw new HttpException(409, 'Mutation has been canceled/completed');

    await DB.Mutation.update({ status: 'REJECTED', receiverNotes: notes, receiverName: name }, { where: { id: mutationId } });
    const updatedMutation = await DB.Mutation.findByPk(mutationId);
    return updatedMutation;
  }

  public async getAllMutation({
    page,
    s,
    order,
    limit,
    filter,
    externalId,
    warehouse,
    manage,
  }: GetFilterMutation): Promise<{ mutations: Mutation[]; totalPages: number }> {
    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
    let action = '';
    if (manage === 'SEND') {
      action = 'senderWarehouseId';
    } else if (manage === 'RECEIVE') {
      action = 'receiverWarehouseId';
    }
    const findWarehouse = await this.warehouse.findWarehouseByName(warehouse);
    if (!findWarehouse) throw new HttpException(409, "warehouse doesn't exist");
    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const options: FindOptions<Mutation> = {
      offset,
      limit: LIMIT,
      where: {
        [action]: findWarehouse.id,
        ...(s && { name: { [Op.like]: `%${s}%` } }),
        ...(manage === 'RECEIVE' && { status: { [Op.not]: 'CANCELED' } }),
      },
      ...(order && {
        order: filter === 'product' ? [[{ model: ProductModel, as: 'productMutation' }, 'name', order]] : [[filter, order]],
      }),
      include: [
        {
          model: ProductModel,
          as: 'productMutation',
          attributes: ['name'],
        },
        {
          model: WarehouseModel,
          as: 'senderWarehouse',
          attributes: ['name'],
        },
        {
          model: WarehouseModel,
          as: 'receiverWarehouse',
          attributes: ['name'],
        },
      ],
    };

    const allMutation = await DB.Mutation.findAll(options);
    const totalCount = await DB.Mutation.count(options);
    const totalPages = Math.ceil(totalCount / LIMIT);

    return { totalPages: totalPages, mutations: allMutation };
  }
}
