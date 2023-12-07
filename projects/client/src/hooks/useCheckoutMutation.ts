import service from "@/service";
import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type Location = {
  lat: number;
  lng: number;
};

export const useClosestWarehouse = () => {
  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async (location: Location) => {
      return service.post("/checkout/find-closest-warehouse", location, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
    },
  });

  return mutation;
};
