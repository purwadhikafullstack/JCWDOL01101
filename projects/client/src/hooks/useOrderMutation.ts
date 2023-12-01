import service from "@/service";
import { useMutation } from "@tanstack/react-query";

type Location = {
  lat: number;
  lng: number;
};

export const useClosestWarehouse = () => {
  const mutation = useMutation({
    mutationFn: async (location: Location) => {
      return service.post("/order/find-closest-warehouse", location);
    },
  });

  return mutation;
};
