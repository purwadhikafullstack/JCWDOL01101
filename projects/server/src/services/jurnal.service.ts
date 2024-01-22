import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/interfaces';
import { GetFilterJurnal, Jurnal, JurnalData } from '@/interfaces/jurnal.interface';
import { Transaction } from 'sequelize';
import { Service } from 'typedi';
import { FindOptions, Op } from 'sequelize';

@Service()
export class JurnalService {
  public async findAllJurnal({ page, s, order, limit, filter, externalId, warehouse, to, from }: GetFilterJurnal): Promise<{
    jurnals: Jurnal[];
    totalPages: number;
    totalAddition: number;
    totalReduction: number;
    finalStock: number;
    totalProductValue: number;
  }> {
    const findUser: User = await DB.User.findOne({
      where: { externalId, status: 'ACTIVE' },
      include: [{ model: DB.Warehouses, as: 'warehouse', attributes: ['id'] }],
    });
    if (!findUser) throw new HttpException(409, "user doesn't exist");
    const role = findUser.role;
    const where =
      role === 'ADMIN'
        ? { ...(warehouse && warehouse !== 'ALL' && { id: Number(warehouse) }) }
        : role === 'WAREHOUSE ADMIN'
        ? { userId: findUser.id }
        : {};
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
              warehouseId: findUser.warehouse.id,
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
              attributes: ['name', 'price'],
              where: {
                ...(s && {
                  name: {
                    [DB.Sequelize.Op.like]: `%${s}%`,
                  },
                }),
              },
              include: [
                {
                  model: DB.Categories,
                  as: 'productCategory',
                  attributes: ['name'],
                },
              ],
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

    const optionsCount: FindOptions<Jurnal> = {
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
              warehouseId: findUser.warehouse.id,
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
    const allJurnalCount = await DB.Jurnal.findAll(optionsCount);

    let totalAddition = 0;
    let totalReduction = 0;
    let totalProductValue = 0;
    for (const jurnal of allJurnalCount) {
      if (jurnal.type === '1') {
        totalAddition += jurnal.qtyChange;
      } else if (jurnal.type === '0') {
        totalReduction += jurnal.qtyChange;
      }
      if (jurnal.notes.startsWith('Stock out order INV-')) {
        const inventory = await DB.Inventories.findOne({
          where: { id: jurnal.inventoryId },
          include: [{ model: DB.Product, as: 'product' }],
        });
        if (inventory && inventory.product) {
          totalProductValue += inventory.product.price * jurnal.qtyChange;
        }
      }
    }
    const finalStock = totalAddition - totalReduction;

    return { totalPages: totalPages, jurnals: allJurnal, totalAddition, totalReduction, finalStock, totalProductValue };
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

  public async jurnalExchangeStock(jurnalData: JurnalData, transaction: Transaction) {
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
