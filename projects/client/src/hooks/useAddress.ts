import service from "@/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Address, City, Province } from "@/context/UserContext";

type AddresForm = {
  cityId: string,
  provinceId: string,
  addressDetail?: string,
  isPrimary?: string,
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

export const useAddress = (userId: number) => {
  const { data, isLoading } = useQuery<Address>({
    queryKey: ["address", userId],
    queryFn: async () => {
      const res = await service.get(`/addresses/user/${userId}`, {
        withCredentials: true,
      });
      return res.data.data;
    },
    enabled: !!userId,
  });

  return { data, isLoading };
};

export const useAddressMutation = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addressMutation = useMutation({
    mutationFn: async (address: AddresForm) => {
      await service.post("/address", { userId, ...address });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Opps!, Something went Wrong",
          description: error.response?.data.message,
          variant: "destructive",
        });
      }
    },
  });

  return { addressMutation };
};

export const useEditAddress = ({ addressId, userId }: { addressId: number; userId: number }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async (address: AddresForm) =>
      service.put(`/addresses/${addressId}`, { userId, ...address }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Opps!, Something went Wrong",
          description: error.response?.data.message,
          variant: "destructive",
        });
      }
    },
  });

  return addressMutation;
};

export const useDeleteAddress = (addressId: number) => {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async () => service.delete(`/address/${addressId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  return addressMutation;
};
