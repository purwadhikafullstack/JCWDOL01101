import service from "@/service";
import { useQuery } from "@tanstack/react-query";

export const useHello = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["greeting"],
    queryFn: async () => {
      const res = await service.get("/greetings");
      return res.data.data;
    },
  });

  return { data, isLoading };
};
