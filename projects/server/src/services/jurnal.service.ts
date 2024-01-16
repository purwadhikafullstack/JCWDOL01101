import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces';
import { GetFilterJurnal, Jurnal, JurnalData } from '@/interfaces/jurnal.interface';
import { Service } from 'typedi';
import { FindOptions, Op } from 'sequelize';

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
    to,
    from,
  }: GetFilterJurnal): Promise<{ jurnals: Jurnal[]; totalPages: number; totalAddition:number; totalReduction:number; finalStock:number }> {
    const findUser: User = await DB.User.findOne({
      where: { externalId, status: 'ACTIVE' },
      include: [{ model: DB.Warehouses, as: 'userData', attributes: ['id'] }],
    });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
    const role = findUser.role;
    const where =
      role === 'ADMIN'
        ? {
            ...(warehouse && warehouse !== 'ALL' && { id: Number(warehouse) }),
          }
        : role === 'WAREHOUSE ADMIN'
        ? {
            userId: findUser.id,
          }
        : {};
    const date = new Date();
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (from && to) {
      firstDayOfMonth = new Date(from);
      lastDayOfMonth = new Date(to);
    }
    const LIMIT = Number(limit) || 10;
    const offset = (page - 1) * LIMIT;
    const options: FindOptions<Jurnal> = {
      offset,
      limit: LIMIT,
      where: {
        createdAt: {
          [Op.between]: [new Date(from), new Date(to)],
        },
      },
      include: [
        {
          model: DB.Inventories,
          as: 'jurnal',
          attributes: ['stock'],
          where: {
            ...(role === 'WAREHOUSE ADMIN' && {
              warehouseId: findUser.userData.id,
            }),
          },
          include: [
            {
              model: DB.Warehouses,
              as: 'warehouse',
              attributes: ['name'],
              where,
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
              where: {
                ...(s && {
                  name: {
                    [DB.Sequelize.Op.like]: `%${s}%`,
                  },
                }),
              },
            },
          ],
        },
      ],
    };

    if (order) {
      options.order = [[filter, order]];
    }

    const allJurnal = await DB.Jurnal.findAll(options);
    const totalCount = await DB.Jurnal.count({ where: options.where });
    const totalPages = Math.ceil(totalCount / LIMIT);

    let totalAddition = 0;
    let totalReduction = 0;
    allJurnal.forEach(jurnal => {
      if (jurnal.type === '1') {
        totalAddition += jurnal.qtyChange;
      } else if (jurnal.type === '0') {
        totalReduction += jurnal.qtyChange;
      }
    });

    const finalStock = totalAddition - totalReduction;

    return { totalPages: totalPages, jurnals: allJurnal, totalAddition, totalReduction, finalStock };
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

  public async getStockSummary({
    from,
    to,
    s,
  }: Pick<GetFilterJurnal, 'from' | 'to' | 's'>): Promise<{ totalAddition: number; totalReduction: number; finalStock: number }> {
    const where = {
      createdAt: {
        [Op.between]: [from, to],
      },
      '$jurnal.product.name$': {
        [Op.like]: `%${s}%`,
      },
    };

    const jurnals = await DB.Jurnal.findAll({
      where,
      include: [
        {
          model: DB.Inventories,
          as: 'jurnal',
          attributes: ['stock'],
          include:[
            {
              model: DB.Product,
              as: 'product',
              attributes: [],
            }
          ]
        },
      ],
    });

    let totalAddition = 0;
    let totalReduction = 0;
    jurnals.forEach(jurnal => {
      if (jurnal.type === '1') {
        totalAddition += jurnal.qtyChange;
      } else if (jurnal.type === '0') {
        totalReduction += jurnal.qtyChange;
      }
    });

    const finalStock = totalAddition - totalReduction;
    return { totalAddition, totalReduction, finalStock };
  }
}
