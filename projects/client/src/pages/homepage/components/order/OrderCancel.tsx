import React, { useEffect, FormEvent } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteAdmin } from "@/hooks/useUserMutation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCancelOrder } from "@/hooks/useOrderMutation"

const CancelOrder = ({ orderId }: { orderId: Number }) => {
  const cancelOrder = useCancelOrder(orderId as number)
  const { toast } = useToast()
  const onCancelOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    cancelOrder.mutate()
  }

  useEffect(() => {
    if (cancelOrder.isSuccess) {
      toast({
        title: "order cancelled",
        description: "Successfully cancel order",
        duration: 3000,
      })
    }
  }, [cancelOrder.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancel This Order</DialogTitle>
        <DialogDescription>You're about to cancel this order</DialogDescription>
      </DialogHeader>
      <form onSubmit={onCancelOrder}>
        <span className="flex justify-center gap-4 w-full">
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
            Yes, cancel my order
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

export default CancelOrder
