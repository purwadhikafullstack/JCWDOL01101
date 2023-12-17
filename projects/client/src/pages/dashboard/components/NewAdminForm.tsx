import React, { useEffect, FormEvent } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAdminMutation } from "@/hooks/useUserMutation"
import { Loader2 } from "lucide-react"

const NewAdminFrom = () => {
  const { adminMutation, error: resError } = useAdminMutation()
  const { toast } = useToast()

  const onCreateAdmin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    adminMutation.mutate()
  }

  useEffect(() => {
    if (resError?.state) {
      toast({
        title: `Error: ${resError.status}`,
        description: resError.message,
        variant: "destructive",
        duration: 2000,
      })
    }
  }, [resError, toast])

  useEffect(() => {
    if (!resError?.state && adminMutation.status === "success") {
      toast({
        title: "Admin Warehouse Created",
        description: "Successfully create a new product",
        duration: 2000,
      })
    }
  }, [adminMutation.status, toast, resError])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Admin Warehouse</DialogTitle>
        <DialogDescription>
          You're about to create a new admin warehouse
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onCreateAdmin}>
        <span className="flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            disabled={adminMutation.isPending}
            className="cursor-pointer "
          >
            <Loader2
              className={
                adminMutation.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
              }
            />
            Yes, create admin
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

export default NewAdminFrom
