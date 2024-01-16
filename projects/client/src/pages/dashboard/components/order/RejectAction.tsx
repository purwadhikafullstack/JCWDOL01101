import React, { FormEvent, useEffect, useState } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAdminRejectOrder } from "@/hooks/useOrderMutation"

const RejectAction = ({
  orderId,
  setModal,
}: {
  orderId: number
  setModal: (value: string) => void
}) => {
  const { toast } = useToast()

  const rejectOrder = useAdminRejectOrder(orderId)
  const handleRejectOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    rejectOrder.mutate()
  }

  useEffect(() => {
    if (rejectOrder.isSuccess) {
      toast({
        title: "Order Rejected",
        description: "Successfully reject customer order",
        duration: 3000,
      })
      setModal("")
    }
  }, [rejectOrder.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject Order</DialogTitle>
        <DialogDescription>
          You're about to reject customer order
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleRejectOrder}>
        <span className="mt-4 flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            disabled={rejectOrder.isPending}
            className="cursor-pointer "
          >
            <Loader2
              className={
                rejectOrder.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
              }
            />
            Yes, reject order
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={rejectOrder.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
        </span>
      </form>
    </DialogContent>
  )
}

export default RejectAction
