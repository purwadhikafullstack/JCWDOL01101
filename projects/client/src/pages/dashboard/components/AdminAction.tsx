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
import { Link } from "react-router-dom"
import z from "zod"
import DeleteAdmin from "./DeleteAdmin"
import { User } from "@/context/UserContext"

export const adminEditSchema = z.object({
  role: z.string().min(1, "Role cannot be empty"),
  username: z.string().min(1, "firstname cannot be empty"),
  firstname: z.string().min(1, "firstname cannot be empty"),
  lastname: z.string(),
  email: z.string().min(1, "Role cannot be empty").email(),
  status: z.string().min(1, "Status cannot be empty"),
  password: z.string().optional(),
})

const AdminAction = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <TableCell className="text-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost" })}
            >
              <DotsHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link to={`/dashboard/manage-admin/${user.id}`}>
                <DropdownMenuItem className="cursor-pointer">
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DialogTrigger className="w-full">
                <DropdownMenuItem className="w-full cursor-pointer">
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteAdmin
            open={open}
            setOpen={setOpen}
            userId={user.id as number}
          />
        </Dialog>
      </TableCell>
    </>
  )
}

export default AdminAction
