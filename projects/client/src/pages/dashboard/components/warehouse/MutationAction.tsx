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
import { Mutation } from "@/hooks/useMutation"
import { toast } from "@/components/ui/use-toast"
export const mutationActionSchema = z.object({
  notes: z.string().trim().optional(),
})
type Action = {
  mutation: Mutation
  manage: string
}
const MutationAction = ({ mutation, manage }: Action) => {
  const [modal, setModal] = useState("ACCEPT")
  return (
    <>
      <TableCell className="text-center">
        {mutation.status !== "ONGOING" ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: "ghost" })}
                disabled={true}
              >
                <DotsHorizontalIcon />
              </DropdownMenuTrigger>
            </DropdownMenu>
          </>
        ) : manage === "SEND" ? (
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
            <CancelAction mutationId={mutation.id!} />
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
            {modal === "ACCEPT" && <AcceptAction mutationId={mutation.id!} />}
            {modal === "REJECT" && <RejectAction mutationId={mutation.id!} />}
          </Dialog>
        )}
      </TableCell>
    </>
  )
}

export default MutationAction
