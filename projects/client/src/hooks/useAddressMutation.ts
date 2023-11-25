import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";

type AddressData = {
  userId: number;
  recepient: string;
  phone: string;
  label: string;
  cityId: number;
  address: string;
  notes?: string;
  isPrimary: boolean;
}

export const usePostAddress = () => {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async (addressData: AddressData) => {
      return await service.post("/address", addressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });

  return addressMutation;
};

export const useToggleAddress = (addressId: number, field: string) => {
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async () => {
      return await service.patch(`/address/toggle/${field}/${addressId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
      queryClient.invalidateQueries({ queryKey: ["active-address"] });
    },
  });

  return addressMutation;
};

export const useEditAddress = ({ addressId, userId }: { addressId: number; userId: number }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const addressMutation = useMutation({
    mutationFn: async (address: AddressData) =>
      service.put(`/addresses/${addressId}`, { ...address, userId }),
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
