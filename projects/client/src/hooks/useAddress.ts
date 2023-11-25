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
  cityId: number;
  address: string;
  notes?: string;
  isPrimary: boolean;
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

export const useAddressByUserId = (userId: number) => {
  const { data, isFetched, isLoading } = useQuery<Address[]>({
    queryKey: ["address", userId],
    queryFn: async () => {
      const res = await service.get(`/address/user/${userId}`);
      return res.data.data;
    },
    enabled: !!userId
  });

  return { data, isFetched, isLoading };
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

export interface City {
  id: number
  provinceId: number
  city: string
  postalCode: number
}

export interface Province {
  id: number
  province: string
}

export const useCity = () => {
  const { data, isFetched } = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await service.get(`/cities`, {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  return { data, isFetched };
};

export const useCityByProvinceId = (provinceId: number) => {
  const { data, isFetched } = useQuery<City[]>({
    queryKey: ["cities", provinceId],
    queryFn: async () => {
      const res = await service.get(`/cities/province/${provinceId}`, {
        withCredentials: true,
      });
      return res.data.data;
    },
    enabled: !!provinceId
  });

  return { data, isFetched };
};

export const useProvince = () => {
  const { data, isFetched } = useQuery<Province[]>({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await service.get(`/provinces`, {
        withCredentials: true,
      });
      return res.data.data;
    },
  });

  return { data, isFetched };
};