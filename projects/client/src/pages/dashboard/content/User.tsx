import React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const users = [
  {
    id: 1,
    name: "mikhail",
    role: "ADMIN",
    status: "ACTIVE",
    created_at: 121212,
    updated_at: 121212,
  },
  {
    id: 2,
    name: "john",
    role: "WAREHOUSE",
    status: "ACTIVE",
    created_at: 121212,
    updated_at: 121212,
  },
]

const User = () => {
  return (
    <div className="flex flex-col p-2 w-full">
      <Button className="self-end">
        <Plus className="w-4 h-4 mr-2" /> New Admin
      </Button>
      <div className="border rounded-md mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>
                  <Button>{user.role}</Button>
                </TableCell>
                <TableCell>
                  <Button>{user.status}</Button>
                </TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell>{user.updated_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default User
