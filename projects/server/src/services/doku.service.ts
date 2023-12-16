import axios, { Axios, AxiosError } from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi';
import { User } from '@/interfaces/user.interface';
import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { DOKU_CLIENT_ID, DOKU_SECRET_KEY, DOKU_URL } from '@/config';
import { CartProduct } from '@/interfaces/cartProduct.interface';
import { OrderDetails } from '@/interfaces/orderDetails.interface';

@Service()
export class DokuService {
  public async createPaymentIntent({
    cartId,
    totalPrice,
    externalId,
    warehouseId,
    shippingFee,
    paymentMethod,
  }: {
    cartId: number;
    totalPrice: number;
    externalId: string;
    warehouseId: number;
    shippingFee: number;
    paymentMethod: string;
  }) {
    const findUser: User = await DB.User.findOne({
      where: { externalId },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const InvoiceNumber = `INV-${Date.now()}`;
    const payload = {
      order: {
        invoice_number: InvoiceNumber,
        amount: totalPrice,
      },
      virtual_account_info: {
        billing_type: 'FIX_BILL',
        expired_time: 60,
        reusable_status: false,
        info1: 'Toten',
        info2: 'Thank you for shopping',
        info3: 'on our store',
      },
      customer: {
        name: `${findUser.firstname || ''} ${findUser.lastname || ''}`.trim() || findUser.email,
        email: findUser.email,
      },
    };

    const targetUrl = `/${paymentMethod}-virtual-account/v2/payment-code`;
    const timestamp = new Date().toISOString();
    const requestId = uuidv4();
    const digest = this.generateDigest(JSON.stringify(payload));
    const signature = this.generateSignature(DOKU_CLIENT_ID, requestId, timestamp, targetUrl, digest, DOKU_SECRET_KEY);

    try {
      const res = await axios.post(`${DOKU_URL}${targetUrl}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': DOKU_CLIENT_ID,
          'Request-Id': requestId,
          'Request-Timestamp': timestamp,
          Signature: signature,
        },
      });
      const data = await res.data;
      if (data) {
        const findUserCart = await DB.Cart.findOne({ where: { id: cartId, status: 'ACTIVE' } });
        if (!findUserCart) throw new HttpException(409, "Cart doesn't exist");
        const cartProducts: CartProduct[] = await DB.CartProduct.findAll({ where: { cartId: findUserCart.id, selected: true, status: 'ACTIVE' } });
        if (cartProducts.length > 0) {
          const createOrder = await DB.Order.create({
            warehouseId,
            totalPrice,
            shippingFee,
            invoice: InvoiceNumber,
            userId: findUser.id,
            status: 'PENDING',
          });
          const orderDetailsData = cartProducts.map(cp => ({
            orderId: createOrder.id,
            productId: cp.productId,
            quantity: cp.quantity,
            price: cp.price,
            sizeId: cp.sizeId,
          }));

          await DB.OrderDetails.bulkCreate(orderDetailsData);
          await DB.CartProduct.update({ status: 'DELETED' }, { where: { cartId: findUserCart.id, selected: true, status: 'ACTIVE' } });
        }
      }
      return data;
    } catch (err) {
      throw new HttpException(500, 'Something went wrong');
    }
  }

  public async verifyNotification(invoice: string, transactionStatus: string) {
    if (transactionStatus !== 'SUCCESS') throw new HttpException(500, 'Something went wrong');
    const findOrder = await DB.Order.findOne({ where: { invoice } });
    if (!findOrder) throw new HttpException(409, "Order doesn't found");
    await DB.Order.update({ status: 'WAITING' }, { where: { invoice } });
  }

  private generateDigest(jsonBody: string) {
    const hash = crypto.createHash('sha256').update(jsonBody, 'utf-8').digest();
    const buffer = Buffer.from(hash);
    return buffer.toString('base64');
  }

  private generateSignature(clientId: string, requestId: string, requestTimestamp: string, requestTarget: string, digest: string, secret: string) {
    let componentSignature = 'Client-Id:' + clientId;
    componentSignature += '\n';
    componentSignature += 'Request-Id:' + requestId;
    componentSignature += '\n';
    componentSignature += 'Request-Timestamp:' + requestTimestamp;
    componentSignature += '\n';
    componentSignature += 'Request-Target:' + requestTarget;

    if (digest) {
      componentSignature += '\n';
      componentSignature += 'Digest:' + digest;
    }

    const hmac256Value = crypto.createHmac('sha256', secret).update(componentSignature.toString()).digest();

    const hmac = Buffer.from(hmac256Value);
    const signature = hmac.toString('base64');

    return 'HMACSHA256=' + signature;
  }
}
