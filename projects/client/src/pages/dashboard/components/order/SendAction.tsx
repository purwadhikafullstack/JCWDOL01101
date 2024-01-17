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
import { useAdminSendOrder } from "@/hooks/useOrderMutation"

const SendAction = ({
  orderId,
  setModal,
}: {
  orderId: number
  setModal: (value: string) => void
}) => {
  const { toast } = useToast()

  const sendOrder = useAdminSendOrder(orderId)
  const handleSendOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendOrder.mutate()
  }

  useEffect(() => {
    if (sendOrder.isSuccess) {
      toast({
        title: "Order Shipped",
        description: "Successfully send customer order",
        duration: 3000,
      })
      setModal("")
    }
  }, [sendOrder.isSuccess, toast])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Send Order</DialogTitle>
        <DialogDescription>
          You're about to ship a customer order
        </DialogDescription>
      </DialogHeader>
      <p>
        Notes: You must wait until the orders actually arrive and ready at the
        warehouse before sending the orders.
      </p>
      <form onSubmit={handleSendOrder}>
        <span className="mt-4 flex justify-center gap-4 w-full">
          <Button
            type="submit"
            variant="destructive"
            disabled={sendOrder.isPending}
            className="cursor-pointer "
          >
            <Loader2
              className={
                sendOrder.isPending ? "animate-spin w-4 h-4 mr-2" : "hidden"
              }
            />
            Yes, send order
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={sendOrder.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
        </span>
      </form>
    </DialogContent>
  )
}

export default SendAction
