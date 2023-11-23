import opencage from 'opencage-api-client';
import { Service } from 'typedi';

type OpenCageResults = {
  formatted: string;
  components: {
    road: string;
    city: string;
    city_district: string;
    country: string;
    county: string;
    postcode: string;
    state: string;
  };
};

@Service()
export class AddressService {
  public async getCurrentLocation(latitude: number, langitude: number): Promise<OpenCageResults> {
    const data = await opencage.geocode({ q: `${latitude}, ${langitude}`, language: 'id' });
    const place: OpenCageResults = data.results[0];

    return place;
  }
}
