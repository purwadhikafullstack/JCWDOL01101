import { AxiosError } from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import service from "@/service";


export interface Categories {
  id: number;
  name: string;
  color: string;
}

type CategoryOption = {
  page: number;
  s: string;
  filter: string;
  order: string;
}

export const useCategories = () => {
  const categories = useQuery<Categories[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await service.get("/categories");
      return res.data.data;
    },
  });

  return categories;

}


export const useFetchCategory = (id:number | null)=>{
  const categories = useQuery<Categories>({
    queryKey: ["categories",id],
    queryFn: async () => {
      const res = await service.get(`/categories/${id}`);
      return res.data.data;
    },
    enabled:!!id
  });

  return categories;
}