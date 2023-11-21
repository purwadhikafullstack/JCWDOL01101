import React from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteAdmin } from "@/hooks/useUser"
import { Loader2 } from "lucide-react"

const DeleteAdmin = ({ userId }: { userId: Number }) => {
  const deleteProduct = useDeleteAdmin(userId as number)

  const onDeleteAdmin = () => {
    deleteProduct.mutate()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete This Admin</DialogTitle>
        <DialogDescription>
          You're about to delete this admin warehouse
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onDeleteAdmin}>
        <span className="flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            className="cursor-pointer "
          >
            <Loader2
              className={
                deleteProduct.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
              }
            />
            Yes, delete admin
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </span>
      </form>
    </DialogContent>
  )
}

export default DeleteAdmin
