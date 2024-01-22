import React, { useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { buttonVariants } from "@/components/ui/button"
import { TableCell } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import RejectAction from "./RejectAction"
import AcceptAction from "./AcceptAction"
import { Order } from "@/hooks/useOrder"
import SendAction from "./SendAction"
import CancelAction from "./CancelAction"

const OrderAction = ({ order }: { order: Order }) => {
  const [modal, setModal] = useState("")
  const status = order.status
  const completed = ["DELIVERED", "SUCCESS", "FAILED", "CANCELED", "REJECTED"]
  return (
    <>
      <TableCell className="text-center">
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost" })}
              disabled={completed.includes(order.status)}
            >
              <DotsHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {status === "WAITING" ? (
                <>
                  <DialogTrigger
                    className="w-full"
                    onClick={() => setModal("ACCEPT")}
                  >
                    <DropdownMenuItem className="w-full cursor-pointer">
                      Accept Order
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <DialogTrigger
                    className="w-full"
                    onClick={() => setModal("REJECT")}
                  >
                    <DropdownMenuItem className="w-full cursor-pointer">
                      Reject Order
                    </DropdownMenuItem>
                  </DialogTrigger>
                </>
              ) : status === "PROCESS" ? (
                <>
                  <DialogTrigger
                    className="w-full"
                    onClick={() => setModal("SEND")}
                  >
                    <DropdownMenuItem className="w-full cursor-pointer">
                      Send Order
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <DialogTrigger
                    className="w-full"
                    onClick={() => setModal("CANCEL")}
                  >
                    <DropdownMenuItem className="w-full cursor-pointer">
                      Cancel Order
                    </DropdownMenuItem>
                  </DialogTrigger>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
          {modal === "ACCEPT" && (
            <AcceptAction orderId={order.id} setModal={setModal} />
          )}
          {modal === "REJECT" && (
            <RejectAction orderId={order.id} setModal={setModal} />
          )}
          {modal === "SEND" && (
            <SendAction orderId={order.id} setModal={setModal} />
          )}
          {modal === "CANCEL" && (
            <CancelAction orderId={order.id} setModal={setModal} />
          )}
        </Dialog>
      </TableCell>
    </>
  )
}

export default OrderAction
