import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi';
import { User } from '@/interfaces/user.interface';
import { DB } from '@/database';
import { HttpException } from '@/exceptions/HttpException';
import { DOKU_CLIENT_ID, DOKU_SECRET_KEY, DOKU_URL } from '@/config';
import { IncomingHttpHeaders } from 'http';

@Service()
export class DokuService {
  public async createPaymentIntent({ totalPrice, externalId, paymentMethod }: { totalPrice: number; externalId: string; paymentMethod: string }) {
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
        name: `${findUser.firstname || ''} ${findUser.lastname || ''}`.trim(),
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
        // await DB.Order.create({})
      }
      return data;
    } catch (err) {
      throw new HttpException(500, 'Something went wrong');
    }
  }

  public async verifyNotification(headers: IncomingHttpHeaders, body: any) {
    // const notificationPath = '/v1/doku/payment/notify';
    // const digest = this.generateDigest(JSON.stringify(body));
    // const signature = this.generateSignature(
    //   headers['client-id'].toString(),
    //   headers['request-id'].toString(),
    //   headers['request-timestamp'].toString(),
    //   notificationPath,
    //   digest,
    //   DOKU_SECRET_KEY,
    // );
    const notificationHeader = headers;
    const notificationBody = JSON.stringify(body);
    const notificationPath = '/v1/doku/payment/notify';

    const digest = crypto.createHash('sha256').update(notificationBody).digest('base64');
    const rawSignature =
      `Client-Id:${notificationHeader['client-id']}\n` +
      `Request-Id:${notificationHeader['request-id']}\n` +
      `Request-Timestamp:${notificationHeader['request-timestamp']}\n` +
      `Request-Target:${notificationPath}\n` +
      `Digest:${digest}`;

    const signature = crypto.createHmac('sha256', DOKU_SECRET_KEY).update(rawSignature).digest('base64');
    const finalSignature = 'HMACSHA256=' + signature;
    if (finalSignature !== headers['signature']) throw new HttpException(400, 'Invalid Signature');

    return 'OK';
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
