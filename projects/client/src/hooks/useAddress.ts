import service from "@/service";
import { useQuery } from "@tanstack/react-query";

type Coordinates = {
  latitude: number;
  langitude: number;
};

export type OpenCageResults = {
  formatted: string;
  components: {
    road: string;
    city: string;
    city_district: string;
    country: string;
    county: string;
    postcode: string;
    state: string;
    region: string;
    village: string;
  };
};

export interface Address {
  id?: number;
  userId?: number;
  recepient: string;
  phone: string;
  label: string;
  city: string;
  address: string;
  notes?: string;
  isMain: boolean;
  isActive: boolean;
  deletedAt: Date | null;
}

export const useGetLocationOnGeo = (coordinates: Coordinates | null) => {
  const coords = useQuery<OpenCageResults>({
    queryKey: ["location", coordinates?.latitude, coordinates?.langitude],
    queryFn: async () => {
      const res = await service.get(
        `/address/current/${coordinates?.latitude}/${coordinates?.langitude}`
      );

      return res.data.data;
    },
    enabled: !!coordinates?.latitude && !!coordinates?.langitude,
  });

  return coords;
};

export const useAddress = () => {
  const query = useQuery<Address[]>({
    queryKey: ["address"],
    queryFn: async () => {
      const res = await service.get("/address");
      return res.data.data;
    },
  });

  return query;
};

export const useAddressById = (addressId: number) => {
  const query = useQuery<Address>({
    queryKey: ["address", addressId],
    queryFn: async () => {
      const res = await service.get(`/address/${addressId}`);
      return res.data.data;
    },
    enabled: !!addressId,
  });

  return query;
};

export const useActiveAddress = () => {
  const query = useQuery<Address>({
    queryKey: ["active-address"],
    queryFn: async () => {
      const res = await service.get("/address/active");
      return res.data.data;
    },
  });

  return query;
};
