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

const OrderAction = ({ orderId }: { orderId: number }) => {
  const [modal, setModal] = useState("")
  return (
    <>
      <TableCell className="text-center">
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost" })}
            >
              <DotsHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger
                className="w-full"
                onClick={() => setModal("ACCEPT")}
              >
                <DropdownMenuItem className="w-full cursor-pointer">
                  Accept
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
              <DialogTrigger
                className="w-full"
                onClick={() => setModal("REJECT")}
              >
                <DropdownMenuItem className="w-full cursor-pointer">
                  Reject
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {modal === "ACCEPT" && (
            <AcceptAction orderId={orderId} setModal={setModal} />
          )}
          {modal === "REJECT" && (
            <RejectAction orderId={orderId} setModal={setModal} />
          )}
        </Dialog>
      </TableCell>
    </>
  )
}

export default OrderAction
