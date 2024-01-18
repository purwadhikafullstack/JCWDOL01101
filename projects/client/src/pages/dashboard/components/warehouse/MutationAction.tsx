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
import CancelAction from "./CancelAction"
import RejectAction from "./RejectAction"
import { z } from "zod"
import AcceptAction from "./AcceptAction"
export const mutationActionSchema = z.object({
  notes: z.string().trim().optional(),
})
type Action = {
  mutationId: number
  manage: string
}
const MutationAction = ({ mutationId, manage }: Action) => {
  const [modal, setModal] = useState("ACCEPT")
  return (
    <>
      <TableCell className="text-center">
        {manage === "SEND" ? (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost" })}
              >
                <DotsHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DialogTrigger className="w-full">
                  <DropdownMenuItem className="w-full cursor-pointer">
                    Cancel
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <CancelAction mutationId={mutationId} />
          </Dialog>
        ) : (
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
            {modal === "ACCEPT" && <AcceptAction mutationId={mutationId} />}
            {modal === "REJECT" && <RejectAction mutationId={mutationId} />}
          </Dialog>
        )}
      </TableCell>
    </>
  )
}

export default MutationAction
