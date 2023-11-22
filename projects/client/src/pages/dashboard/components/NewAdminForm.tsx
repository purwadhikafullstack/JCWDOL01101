import React, { useEffect } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAdminMutation } from "@/hooks/useUser"
import { Loader2 } from "lucide-react"

const NewAdminFrom = () => {
  const { adminMutation, error: resError } = useAdminMutation()
  const { toast } = useToast()

  const onSubmit = () => {
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
      <Button onClick={onSubmit} className="px-8">
        <Loader2
          className={
            adminMutation.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
          }
        />
        Create Admin Warehouse
      </Button>
    </DialogContent>
  )
}

export default NewAdminFrom
