import { User } from "@/context/UserContext";
import service from "@/service";
import { useQuery } from "@tanstack/react-query";

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
      const res = await service.get(`/user/${externalId}`);
      return res.data.data;
    },
    enabled,
  });

  return user;
};
