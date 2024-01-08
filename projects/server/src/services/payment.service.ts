import { DB } from '@/database';
import { PaymentDto } from '@/dtos/payment.dto';
import { Payment } from '@/interfaces/payment.interface';
import { Service } from 'typedi';

@Service()
export class PaymentDetailService {
  public async createPaymentDetail(paymentData: PaymentDto): Promise<Payment> {
    const createPaymentDetail = await DB.PaymentDetails.create({ ...paymentData });

    return createPaymentDetail;
  }
}
