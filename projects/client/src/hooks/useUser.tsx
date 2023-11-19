import service from "@/service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"

export interface User {
  id?: number
  warehouseId?: number
  addressId?: number
  externalId: string
  role: string
  username: string
  firstname: string
  lastname: string
  email: string
  imageUrl: string
  status: string
  createdAt: string
  updatedAt: string
}

interface UserOptions {
  page: number
  s?: string
  r?: string
}

export const useUsers = ({ page, s, r }: UserOptions) => {
  const { data, isLoading, isFetched } = useQuery<{
    users: User[]
    totalPages: number
  }>({
    queryKey: ["users", page, r, s],
    queryFn: async () => {
      const res = await service.get("/users", {
        params: {
          page,
          r,
          s,
        },
        withCredentials: true,
      })
      return res.data.data
    },
    refetchOnWindowFocus: true,
  })

  return { data, isLoading, isFetched }
}
