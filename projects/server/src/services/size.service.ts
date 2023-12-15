import { DB } from '@/database';
import { Service } from 'typedi';
import { Size } from '@/interfaces/size.interface';

@Service()
export class SizeService {
  public async findAllSize(): Promise<Size[]> {
    const findSize: Size[] = await DB.Size.findAll();
    return findSize;
  }
}
