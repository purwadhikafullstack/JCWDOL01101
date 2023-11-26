import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi';

@Service()
export class DokuService {
  public async createPaymentIntent() {
    const InvoiceNumber = `INV-${Date.now()}`;
    const payload = {
      order: {
        invoice_number: InvoiceNumber,
        amount: 150000,
      },
      virtual_account_info: {
        billing_type: 'FIX_BILL',
        expired_time: 60,
        reusable_status: false,
        info1: 'Merchant Demo Store',
      },
      customer: {
        name: 'Anton Budiman',
        email: 'anton@example.com',
      },
    };

    const clientId = 'BRN-0289-1699928468079';
    const timestamp = new Date().toISOString();
    const requestId = uuidv4();
    const targetUrl = '/dokuwallet-emoney/v1/payment';
    const digest = this.generateDigest(JSON.stringify(payload));
    const secretKey = 'SK-CNTgNYJU8kv8PQQiPJHs';
    const signature = this.generateSignature(clientId, requestId, timestamp, targetUrl, digest, secretKey);

    try {
      const res = await axios.post('https://api-sandbox.doku.com/dokuwallet-emoney/v1/payment', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': clientId,
          'Request-Id': requestId,
          'Request-Timestamp': timestamp,
          Signature: signature,
        },
      });
      return res.data;
    } catch (err) {
      console.log(err.response?.data);
    }
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
