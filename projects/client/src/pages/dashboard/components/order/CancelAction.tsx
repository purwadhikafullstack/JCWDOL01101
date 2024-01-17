import React, { FormEvent, useEffect } from "react"
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
import { useAdminCancelOrder } from "@/hooks/useOrderMutation"

const CancelAction = ({
  orderId,
  setModal,
}: {
  orderId: number
  setModal: (value: string) => void
}) => {
  const { toast } = useToast()

  const cancelOrder = useAdminCancelOrder(orderId)
  const handleCancelOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    cancelOrder.mutate()
  }

  useEffect(() => {
    if (cancelOrder.isSuccess) {
      toast({
        title: "Order Canceled",
        description: "Successfully return stock and cancel order",
        duration: 3000,
      })
      setModal("")
    }
  }, [cancelOrder.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogDescription>
          You're about to cancel customer order
        </DialogDescription>
      </DialogHeader>
      <p>
        Notes: You only can cancel order if there are no product available, and
        can't exchange stock.
      </p>
      <form onSubmit={handleCancelOrder}>
        <span className="mt-4 flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            disabled={cancelOrder.isPending}
            className="cursor-pointer "
          >
            <Loader2
              className={
                cancelOrder.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
              }
            />
            Yes, cancel order
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={cancelOrder.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
        </span>
      </form>
    </DialogContent>
  )
}

export default CancelAction
