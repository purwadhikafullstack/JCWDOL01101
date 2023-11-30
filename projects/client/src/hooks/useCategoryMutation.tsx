import { useMutation, useQueryClient } from "@tanstack/react-query"
import service from "@/service"

type CategoryData = {
    id?:number;
    name: string;
    color: string;
}

export const useCategoryMutation = () => {
    const queryClient = useQueryClient()
    const category = useMutation({
        mutationFn: async (data: CategoryData) => {
            return service.post('/categories', data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ //update
                queryKey: ["categories"]
            })
        }
    })

    return category;
}

export const useEditCategoryMutation = () => {
    const queryClient = useQueryClient()
    const category = useMutation({
        mutationFn: async (data: CategoryData) => {
            return service.put(`/categories/${data.id}`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
        }
    })

    return category;
}

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient()
    const category = useMutation({
        mutationFn: async (id: number) => {
            return service.delete(`/categories/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
        }
    })

    return category;
}
