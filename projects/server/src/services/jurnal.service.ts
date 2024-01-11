import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces';
import { GetFilterJurnal, Jurnal, JurnalData } from '@/interfaces/jurnal.interface';
import { Service } from 'typedi';
import { queryStringToArray } from './product/queryStringToArray';
import { FindOptions } from 'sequelize';

@Service()
export class JurnalService {
  public async findAllJurnal(): Promise<Jurnal[]> {
    const allJurnal: Jurnal[] = await DB.Jurnal.findAll({
      include: [
        {
          model: DB.Inventories,
          as: 'jurnal',
          attributes: ['stock'],
          include: [
            {
              model: DB.Warehouses,
              as: 'warehouse',
              attributes: ['name'],
            },
            {
              model: DB.Size,
              as: 'sizes',
              attributes: ['label'],
            },
            {
              model: DB.Product,
              as: 'product',
              attributes: ['name'],
            },
          ],
        },
      ],
    });
    return allJurnal;
  }

  public async findAllJurnaltes({
    page,
    s,
    order,
    limit,
    filter,
    externalId,
    warehouse,
    product,
    size,
  }: GetFilterJurnal): Promise<{ jurnals: Jurnal[]; totalPages: number }> {
    // limit = limit || 10;
    // page = page || 1;

    const findUser: User = await DB.User.findOne({ where: { externalId } });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
    const role = findUser.role;
    const where =
      role === 'ADMIN'
        ? {
            ...(warehouse && { id: Number(warehouse) }),
          }
        : role === 'WAREHOUSE ADMIN'
        ? {
            userId: findUser.id,
          }
        : {};

    // const products = queryStringToArray(product);
    // const sizes = queryStringToArray(size);

    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;

    const options: FindOptions<Jurnal> = {
      // offset: (page - 1) * limit,
      // limit: limit,
      offset,
      limit: LIMIT,
      include: [
        {
          model: DB.Inventories,
          as: 'jurnal',
          attributes: ['stock'],
          include: [
            {
              model: DB.Warehouses,
              as: 'warehouse',
              attributes: ['name'],
            },
            {
              model: DB.Size,
              as: 'sizes',
              attributes: ['label'],
            },
            {
              model: DB.Product,
              as: 'product',
              attributes: ['name'],
            },
          ],
        },
      ],
    };

    if (order) {
      options.order = [[filter, order]];
    }

    const allJurnal = await DB.Jurnal.findAll(options);
    const totalCount = await DB.Jurnal.count(options);
    const totalPages = Math.ceil(totalCount / LIMIT);

    return  { totalPages: totalPages, jurnals: allJurnal };
  }

  public async findJurnalById(jurnalId: number): Promise<Jurnal> {
    const findJurnal: Jurnal = await DB.Jurnal.findByPk(jurnalId);
    if (!findJurnal) throw new HttpException(409, "Jurnal doesn't exist");

    return findJurnal;
  }

  public async createJurnal(jurnalData: Jurnal): Promise<Jurnal> {
    const createJurnalData: Jurnal = await DB.Jurnal.create({ ...jurnalData });
    return createJurnalData;
  }

  public async updateJurnal(jurnalId: number, jurnalData: Jurnal): Promise<Jurnal> {
    const findJurnal: Jurnal = await DB.Jurnal.findByPk(jurnalId);
    if (!findJurnal) throw new HttpException(409, "Jurnal doesn't exist");

    await DB.Jurnal.update({ ...jurnalData }, { where: { id: jurnalId } });
    const updateJurnal: Jurnal = await DB.Jurnal.findByPk(jurnalId);
    return updateJurnal;
  }

  public async deleteJurnal(jurnalId: number): Promise<Jurnal> {
    const findJurnal: Jurnal = await DB.Jurnal.findByPk(jurnalId);
    if (!findJurnal) throw new HttpException(409, "Jurnal doesn't exist");

    await DB.Jurnal.destroy({ where: { id: jurnalId } });

    return findJurnal;
  }

  public async jurnalExchangeStock(jurnalData: JurnalData, transaction: any) {
    const sendWarehouse = await DB.Warehouses.findByPk(jurnalData.findSenderInventory.warehouseId);
    const receiveWarehouse = await DB.Warehouses.findByPk(jurnalData.findReceiverInventory.warehouseId);
    if (!sendWarehouse && !receiveWarehouse) throw new HttpException(409, 'Warehouses not found');

    const senderJurnal: Jurnal = {
      inventoryId: jurnalData.findSenderInventory.id,
      oldQty: jurnalData.findSenderInventory.stock,
      qtyChange: jurnalData.stock,
      newQty: jurnalData.stockChangeSender,
      type: '1',
      notes: `Stock in from warehouse ${receiveWarehouse.name}`,
    };
    const receiverJurnal: Jurnal = {
      inventoryId: jurnalData.findReceiverInventory.id,
      oldQty: jurnalData.findReceiverInventory.stock,
      qtyChange: jurnalData.stock,
      newQty: jurnalData.stockChangeReceiver,
      type: '0',
      notes: `Stock out to warehouse ${sendWarehouse.name}`,
    };
    await DB.Jurnal.create({ ...senderJurnal }, { transaction });
    await DB.Jurnal.create({ ...receiverJurnal }, { transaction });
  }
}
