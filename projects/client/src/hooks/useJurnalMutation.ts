import { useMutation, useQueryClient } from "@tanstack/react-query";
import service from "@/service";

type JurnalData = {
  id?: number;
  data: FormData;
};

export const useJurnalMutation = () => {
  const queryClient = useQueryClient();
  const jurnal = useMutation({
    mutationFn: async (data: FormData) => {
      return service.post("/jurnals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jurnals"],
      });
    },
  });

  return jurnal;
};

export const useEditJurnalMutation = (slug: string) => {
  const queryClient = useQueryClient();
  const jurnal = useMutation({
    mutationFn: async ({ id, data }: JurnalData) => {
      return service.put(`/jurnals/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jurnals"],
      });
    },
  });

  return jurnal;
};

export const useDeleteJurnalMutation = () => {
  const queryClient = useQueryClient();
  const jurnal = useMutation({
    mutationFn: async (id: number) => {
      return service.delete(`/jurnals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jurnals"],
      });
    },
  });

  return jurnal;
};
