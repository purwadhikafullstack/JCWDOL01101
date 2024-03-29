import { useToast } from "@/components/ui/use-toast";
import service from "@/service";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useProductMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const productMutation = useMutation({
    mutationFn: async (product: FormData) => {
      await service.post("/products", product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Opps, Something went Wrong",
          description: error.response?.data.message,
          variant: "destructive",
        });
      }
    },
  });

  return { productMutation };
};

export const useEditProduct = (slug: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async (product: FormData) =>
      service.put(`/products/${slug}`, product, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error) => {
      if (error instanceof AxiosError) {
        toast({
          title: "Opps, Something went Wrong",
          description: error.response?.data.message,
          variant: "destructive",
        });
      }
    },
  });

  return productMutation;
};

type STATUS = "ACTIVE" | "DEACTIVATED" | "DELETED";
interface StatusData {
  previousStatus?: STATUS;
  warehouseId?: string | number | undefined;
  status: STATUS;
}

interface ChangeStatusData extends StatusData {
  productId: number;
}

export const useChangeAllStatus = () => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async (data: StatusData) =>
      service.patch(`/products/all-status/${data.warehouseId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return productMutation;
};
export const useChangeStatus = () => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async (data: ChangeStatusData) =>
      service.patch(`/products/status/${data.productId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return productMutation;
};

type ChangeStatusInventoryData = {
  productId: number;
  warehouseId: number;
  status: "ACTIVE" | "DEACTIVATED" | "DELETED";
};
export const useChangeStatusInventory = () => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async (data: ChangeStatusInventoryData) =>
      service.patch(
        `/products/status/${data.productId}/${data.warehouseId}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return productMutation;
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  const productMutation = useMutation({
    mutationFn: async ({ imageId }: { imageId: number }) =>
      service.delete(`/products/images/${imageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });

  return productMutation;
};
