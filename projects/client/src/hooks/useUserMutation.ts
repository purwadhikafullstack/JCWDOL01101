import service from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

type Error = { message: string; status: number; state: boolean };
export const useAdminMutation = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<Error>({
    message: "",
    status: 0,
    state: false,
  });
  const adminMutation = useMutation({
    mutationFn: async () => {
      try {
        await service.post("/admin");
        setError({
          message: "",
          status: 0,
          state: false,
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          setError({
            message: err.response?.data.message as string,
            status: Number(err.response?.status),
            state: true,
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { error, adminMutation };
};

type EditAdmin = {
  role: string;
  username: string;
  firstname: string;
  lastname?: string;
  email: string;
  status: string;
  password?: string;
};

export const useEditAdmin = (userId: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const adminMutation = useMutation({
    mutationFn: async (admin: EditAdmin) =>
      service.put(`/manage-admin/${userId}`, admin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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

  return adminMutation;
};

type EditUser = {
  firstname: string;
  lastname: string;
  username: string;
};

export const useEditUser = (userId: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userMutation = useMutation({
    mutationFn: async (user: EditUser) => {
      return service.put(`/manage-user/${userId}`, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
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

  return userMutation;
};

export const useDeleteAdmin = (userId: number) => {
  const queryClient = useQueryClient();
  const adminDeleteMutation = useMutation({
    mutationFn: async () => service.delete(`/manage-admin/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return adminDeleteMutation;
};
