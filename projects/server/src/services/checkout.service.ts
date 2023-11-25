import { RAJAONGKIR_API_KEY } from '@/config';
import axios from 'axios';
import { Service } from 'typedi';

type Courier = {
  code: string;
  name: string;
  costs: {
    service: string;
    description: string;
    cosnt: {
      value: number;
      edt: string;
      note: string;
    }[];
  }[];
};

@Service()
export class CheckoutService {
  public async getCourierService(origin: string, destination: string, weight: number, courier: string) {
    const res = await axios.post(
      'https://api.rajaongkir.com/starter/cost',
      { origin, destination, weight, courier },
      {
        headers: {
          key: RAJAONGKIR_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const results: Courier = res.data.rajaongkir.results[0];
    return results;
  }
}
