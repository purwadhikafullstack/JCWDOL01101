import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { Jurnal } from '@/interfaces/jurnal.interface';
import opencage from 'opencage-api-client';
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
     
}
