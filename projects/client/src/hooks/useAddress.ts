import service from "@/service";
import { useQuery } from "@tanstack/react-query";

type Coordinates = {
  latitude: number;
  langitude: number;
};

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
    region: string;
    village: string;
  };
};
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
