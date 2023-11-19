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

type Error = { message: string; status: number; state: boolean }
export const useAdminMutation = () => {
  const queryClient = useQueryClient()
  const [error, setError] = useState<Error>({
    message: "",
    status: 0,
    state: false,
  })
  const adminMutation = useMutation({
    mutationFn: async () => {
      try {
        await service.post("/admin")
        setError({
          message: "",
          status: 0,
          state: false,
        })
      } catch (err) {
        if (err instanceof AxiosError) {
          setError({
            message: err.response?.data.message as string,
            status: Number(err.response?.status),
            state: true,
          })
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] })
    },
  })

  return { error, adminMutation }
}
