import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";

export interface mutation {
  id?: number;
  senderWarehouseId?: number;
  receiverWarehouseId?: number;
  senderName: string;
  receiverName?: string;
  productId?: number;
  quantity: number;
  notes?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface postMutation {
  senderWarehouseId: number;
  receiverWarehouseId: number;
  senderName: string;
  productId: number;
  quantity: number;
  notes?: string;
}
export const usePostMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (mutation: postMutation) => {
      await service.post("/mutation", mutation);
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
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async () => {
      await service.patch(`/mutation/${mutationId}`);
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
}

export const useRejectMutation = (mutationId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const editMutation = useMutation({
    mutationFn: async (name: string) => {
      await service.patch(`/mutation/${mutationId}`, name);
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
}