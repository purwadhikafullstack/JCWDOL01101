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
import { useConfirmOrder } from "@/hooks/useOrderMutation"

const ConfirmOrder = ({ orderId }: { orderId: Number }) => {
  const confirmOrder = useConfirmOrder(orderId as number)
  const { toast } = useToast()
  const onConfirmlOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    confirmOrder.mutate()
  }

  useEffect(() => {
    if (confirmOrder.isSuccess) {
      toast({
        title: "Order Finished",
        description: "Successfully Finish Order",
        duration: 3000,
      })
    }
  }, [confirmOrder.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Finish This Order?</DialogTitle>
        <DialogDescription>You're about to finish this order</DialogDescription>
      </DialogHeader>
      <form onSubmit={onConfirmlOrder}>
        <span className="flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            disabled={confirmOrder.isPending}
            className="cursor-pointer "
          >
            <Loader2
              className={
                confirmOrder.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
              }
            />
            Yes, finish my order
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

export default ConfirmOrder
