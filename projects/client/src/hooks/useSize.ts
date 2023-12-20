import service from "@/service";
import { useQuery } from "@tanstack/react-query";

export interface Size {
  id: number;
  label: string;
  value: number;
}

export const useSize = () => {
  const size = useQuery<Size[]>({
    queryKey: ["size"],
    queryFn: async () => {
      const res = await service.get(`/size`);
      return res.data.data;
    },
  });

  return size;
};

export const useSizeByProductId = (productId: number) => {
  const size = useQuery<Size[]>({
    queryKey: ["size", productId],
    queryFn: async () => {
      const res = await service.get(`/size/products/${productId}`);
      return res.data.data;
    },
  });

  return size;
};
