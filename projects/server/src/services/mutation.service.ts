import { DB } from '@/database';
import { MutationDto } from '@/dtos/mutation.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Mutation } from '@/interfaces/mutation.interface';
import { Product } from '@/interfaces/product.interface';
import { Service } from 'typedi';
import { FindOptions, Op } from 'sequelize';

@Service()
export class MutationService {
  public async createMutation(mutationData: MutationDto): Promise<Mutation> {
    const product = await DB.Product.findOne({ where: { id: mutationData.productId } });
    if (!product) throw new HttpException(409, "Product doesn't exist");

    const productStock = await DB.Inventories.findOne({
      where: { warehouseId: mutationData.receiverWarehouseId, productId: mutationData.productId },
    });
    if (!productStock) throw new HttpException(409, 'No stock available');
    if (productStock.stock < 20) throw new HttpException(409, 'Product stock not meet requirement');
    const mutation = await DB.Mutation.create({ ...mutationData, status: 'ONGOING' });
    return mutation;
  }

  public async cancelMutation(mutationId: number) {
    const findMutation = await DB.Mutation.findOne({ where: { id: mutationId, status: 'ONGOING' } });
    if (!findMutation) throw new HttpException(409, "Ongoing mutation doesn't exist");

    await DB.Mutation.update({ status: 'CANCELED' }, { where: { id: mutationId } });
    const updatedMutation = await DB.Mutation.findByPk(mutationId);
    return updatedMutation;
  }

  public async acceptMutation(mutationId: number, name: string) {
    await DB.Mutation.update({ status: 'COMPLETED', receiverName: name }, { where: { id: mutationId } });
    const updatedMutation = await DB.Mutation.findByPk(mutationId);
    return updatedMutation;
  }

  public async rejectMutation(mutationId: number, name: string) {
    await DB.Mutation.update({ status: 'REJECTED', receiverName: name }, { where: { id: mutationId } });
    const updatedMutation = await DB.Mutation.findByPk(mutationId);
    return updatedMutation;
  }

  public async getProductByName(search: string): Promise<Product[]> {
    const options: FindOptions<Product> = {
      where: search
        ? {
          [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
        }
        : {},
    };
    const findProduct: Product[] = await DB.Product.findAll(options);
    return findProduct;
  }
}
