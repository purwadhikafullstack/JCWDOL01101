import service from "@/service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/clerk-react";

export interface Mutation {
  id?: number;
  senderWarehouseId?: number;
  receiverWarehouseId?: number;
  senderName: string;
  receiverName?: string;
  productId?: number;
  quantity: number;
  senderNotes?: string;
  receiverNotes?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  productMutation: { name: string };
  senderWarehouse: { name: string };
  receiverWarehouse: { name: string };
  sizeMutation: { label: string };
}
export interface postMutation {
  senderWarehouseId: number;
  receiverWarehouseId: number;
  senderName: string;
  productId: number;
  quantity: number;
  notes?: string;
}

type mutationOptions = {
  page: number;
  s: string;
  filter: string;
  order: string;
  limit: number;
  warehouse: string;
  manage: string;
};

export const useGetMutation = ({
  page,
  s,
  filter,
  order,
  limit,
  warehouse,
  manage,
}: mutationOptions) => {
  const { getToken } = useAuth();
  const { data, isLoading, isFetched } = useQuery<{
    mutations: Mutation[];
    totalPages: number;
  }>({
    queryKey: ["mutations", page, s, filter, order, warehouse, manage],
    queryFn: async () => {
      const res = await service.get("/mutations", {
        params: {
          s,
          page,
          order,
          limit,
          filter,
          warehouse,
          manage,
        },
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      return res.data.data;
    },
  });

  return { data, isLoading, isFetched };
};

export const usePostMutation = () => {
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (mutation: postMutation) => {
      await service.post("/mutations", mutation, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mutations"] });
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

  return createMutation;
};

export const useCancelMutation = (mutationId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async () => {
      await service.patch(`/mutations/cancel/${mutationId}`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mutations"] });
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

export const useAcceptMutation = (mutationId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async (data: { name: string; notes?: string }) => {
      await service.patch(`/mutations/accept/${mutationId}`, data, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mutations"] });
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

export const useRejectMutation = (mutationId: number) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async (data: { name: string; notes?: string }) => {
      await service.patch(`/mutations/reject/${mutationId}`, data, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mutations"] });
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
