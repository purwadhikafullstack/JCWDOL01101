import service from "@/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/context/UserContext";

interface UserOptions {
  page: number;
  s: string;
  r: string;
  filter: string;
  order: string;
}

export const useCurrentUser = ({
  externalId,
  enabled,
}: {
  externalId: string;
  enabled: boolean;
}) => {
  const user = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await service.get(`/users/${externalId}`);
      return res.data.data;
    },
    enabled,
  });

  return user;
};

export const useUsers = ({ page, s, r, filter, order }: UserOptions) => {
  const { data, isLoading, isFetched } = useQuery<{
    users: User[];
    totalPages: number;
  }>({
    queryKey: ["users", page, r, s, filter, order],
    queryFn: async () => {
      const res = await service.get("/users", {
        params: {
          s,
          filter,
          order,
          page,
          r,
        },
        withCredentials: true,
      });
      return res.data.data;
    },
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, isFetched };
};

export const useUser = (userId: string) => {
  const { data, isLoading } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await service.get(`/user/${userId}`, {
        withCredentials: true,
      });
      return res.data.data;
    },
    enabled: !!userId,
  });

  return { data, isLoading };
};

export const useUserById = (userId: number) => {
  const { data, isLoading } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await service.get(`/dashboard/user/${userId}`, {
        withCredentials: true,
      });
      return res.data.data;
    },
    enabled: !!userId,
  });

  return { data, isLoading };
};

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
  lastname: string;
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
