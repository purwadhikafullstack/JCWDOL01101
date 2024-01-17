import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/clerk-react";

export const useAdminAcceptOrder = (orderId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async () => {
      await service.patch(
        `/orders/admin-accept/${orderId}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
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

export const useAdminRejectOrder = (orderId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async () => {
      await service.patch(
        `/orders/admin-reject/${orderId}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
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

export const useAdminSendOrder = (orderId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async () => {
      await service.patch(
        `/orders/admin-send/${orderId}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
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

export const useAdminCancelOrder = (orderId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async () => {
      await service.patch(
        `/orders/admin-cancel/${orderId}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
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
