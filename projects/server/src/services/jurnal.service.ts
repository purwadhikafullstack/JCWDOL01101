import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Jurnal, JurnalData } from '@/interfaces/jurnal.interface';
import { Service } from 'typedi';

@Service()
export class JurnalService {
  public async findAllJurnal(): Promise<Jurnal[]> {
    const allJurnal: Jurnal[] = await DB.Jurnal.findAll();
    return allJurnal;
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
