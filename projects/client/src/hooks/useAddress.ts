import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
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
    city_code: string;
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
  cityId: string;
  lat: number;
  lng: number;
  address: string;
  notes?: string;
  isMain: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  city: City;
}

export interface ModalAddress {
  id?: number;
  userId?: number;
  recepient: string;
  phone: string;
  label: string;
  cityId: string;
  address: string;
  notes?: string;
  isMain: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  "city.cityName": string;
  "city.province": string;
}

export interface City {
  cityId: string;
  provinceId: string;
  province: string;
  cityName: string;
  postalCode: string;
  type: string;
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

export const useAddress = (search: string) => {
  const { getToken } = useAuth();
  const query = useQuery<ModalAddress[]>({
    queryKey: ["address", search],
    queryFn: async () => {
      const res = await service.get("/address", {
        params: {
          search,
        },
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
  });

  return query;
};

export const useCity = (search: string) => {
  const query = useQuery<City[]>({
    queryKey: ["address/city", search],
    queryFn: async () => {
      const res = await service.get("/address/city", {
        params: {
          search,
        },
      });
      return res.data.data;
    },
    enabled: !!search,
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

export const useActiveAddress = (isSignenIn: boolean | undefined) => {
  const { getToken } = useAuth();
  const query = useQuery<Address>({
    queryKey: ["active-address"],
    queryFn: async () => {
      const res = await service.get("/address/active", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
    enabled: !!isSignenIn,
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
    enabled: !!userId,
  });

  return { data, isFetched, isLoading };
};
