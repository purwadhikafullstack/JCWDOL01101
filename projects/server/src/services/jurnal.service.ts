import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Jurnal, JurnalData } from '@/interfaces/jurnal.interface';
import { Service } from 'typedi';

@Service()
export class JurnalService {
  public async jurnalExchangeStock(jurnalData: JurnalData, transaction: any) {
    const sendWarehouse = await DB.Warehouses.findByPk(jurnalData.findSenderInventory.warehouseId);
    const receiveWarehouse = await DB.Warehouses.findByPk(jurnalData.findReceiverInventory.warehouseId);
    if (!sendWarehouse && !receiveWarehouse) throw new HttpException(409, 'Warehouses not found');
    const date = new Date();

    const senderJurnal: Jurnal = {
      inventoryId: jurnalData.findSenderInventory.id,
      oldQty: jurnalData.findSenderInventory.stock,
      qtyChange: jurnalData.stock,
      newQty: jurnalData.stockChangeSender,
      type: 'STOCK IN',
      date,
      notes: `Stock in from warehouse ${receiveWarehouse.name}`,
    };
    const receiverJurnal: Jurnal = {
      inventoryId: jurnalData.findReceiverInventory.id,
      oldQty: jurnalData.findReceiverInventory.stock,
      qtyChange: jurnalData.stock,
      newQty: jurnalData.stockChangeReceiver,
      type: 'STOCK OUT',
      date,
      notes: `Stock out to warehouse ${sendWarehouse.name}`,
    };
    await DB.Jurnal.create({ ...senderJurnal }, { transaction });
    await DB.Jurnal.create({ ...receiverJurnal }, { transaction });
  }
}
