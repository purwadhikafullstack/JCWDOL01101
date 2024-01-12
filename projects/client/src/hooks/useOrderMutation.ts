import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/clerk-react";

export const useAcceptOrder = (orderId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async () => {
      await service.patch(`/orders/accept/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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

  return editMutation;
};

export const useRejectOrder = (orderId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async () => {
      await service.patch(`/orders/reject/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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

  return editMutation;
};

export const useCancelOrder = (orderId: number) => {
  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async () => {
      return service.post(
        `/orders/cancel/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
    },
  });

  return mutation;
};

export const useConfirmOrder = (orderId: number) => {
  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async () => {
      return service.post(
        `/orders/confirm/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
    },
  });

  return mutation;
};
