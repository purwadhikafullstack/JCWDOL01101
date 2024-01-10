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
import { useAcceptOrder } from "@/hooks/useOrderMutation"

const VerifyInventory = ({ orderId }: { orderId: number }) => {
  const { toast } = useToast()

  const acceptOrder = useAcceptOrder(orderId)
  const handleAcceptOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    acceptOrder.mutate()
  }

  useEffect(() => {
    if (acceptOrder.isSuccess) {
      toast({
        title: "Order Confirmed",
        description: "Successfully confirmed customer order",
        duration: 3000,
      })
    }
  }, [acceptOrder.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Accept Order</DialogTitle>
        <DialogDescription>
          You're about to accept customer order
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleAcceptOrder}>
        <span className="mt-4 flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            disabled={acceptOrder.isPending}
            className="cursor-pointer "
          >
            <Loader2
              className={
                acceptOrder.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
              }
            />
            Yes, accept order
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={acceptOrder.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
        </span>
      </form>
    </DialogContent>
  )
}

export default VerifyInventory
