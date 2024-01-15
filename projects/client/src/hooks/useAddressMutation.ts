import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddressData = {
  userId: number;
  recepient: string;
  phone: string;
  label: string;
  cityId: string;
  address: string;
  notes?: string;
  isMain: boolean;
};

export const usePostAddress = () => {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async (addressData: AddressData) => {
      return await service.post("/address", addressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      queryClient.invalidateQueries({ queryKey: ["active-address"] });
    },
  });

  return addressMutation;
};

export const usePutAddress = (addressId: number) => {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async (addressData: AddressData) => {
      return await service.put(`/address/${addressId}`, addressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });

  return addressMutation;
};

export const useDeleteAddress = (addressId: number) => {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async () => service.delete(`/address/${addressId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });

  return addressMutation;
}

export const useToggleAddress = (addressId: number, field: string) => {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async () => {
      return await service.patch(`/address/toggle/${field}/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      queryClient.invalidateQueries({ queryKey: ["active-address"] });
      queryClient.invalidateQueries({ queryKey: ["courier", "jne"] });
      queryClient.invalidateQueries({ queryKey: ["courier", "pos"] });
      queryClient.invalidateQueries({ queryKey: ["courier", "tiki"] });
    },
  });

  return addressMutation;
};

export const useSetMainAddress = (addressId: number) => {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async () => {
      return await service.patch(`/address/set-main/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });

  return addressMutation;
};