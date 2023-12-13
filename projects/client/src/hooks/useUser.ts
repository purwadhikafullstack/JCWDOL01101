import service from "@/service";
import { useQuery } from "@tanstack/react-query";
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
    refetchOnWindowFocus: true,
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

export const useUser = (userId: number) => {
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
