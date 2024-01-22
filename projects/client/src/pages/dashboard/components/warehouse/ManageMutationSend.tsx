import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import MutationAction from "./MutationAction"
import { getDate } from "@/lib/utils"
import ChangeOrderButton from "../ChangeOrderButton"
import { Mutation } from "@/hooks/useMutation"

function ManageMutationSend({
  data,
}: {
  data: { mutations: Mutation[]; totalPages: number }
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">#</TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="product" name="Product Name" />
          </TableHead>
          <TableHead className="text-center">Size</TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="quantity" name="Quantity" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton
              paramKey="senderWarehouseId"
              name="From Warehouse"
            />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton
              paramKey="receiverWarehouseId"
              name="Appointed Warehouse"
            />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="senderNotes" name="Request Notes" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton
              paramKey="receiverNotes"
              name="Incomming Notes"
            />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="status" name="Status" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="createdAt" name="Created At" />
          </TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.mutations && data.mutations.length > 0 ? (
          <>
            {data?.mutations!.map((mutation, i) => (
              <TableRow key={mutation.id}>
                <TableCell className="w-[80px]">{i + 1}</TableCell>
                <TableCell className="capitalize font-medium text-center">
                  {mutation.productMutation.name}
                </TableCell>
                <TableCell className="text-center">
                  {mutation.sizeMutation.label}
                </TableCell>
                <TableCell className="text-center">
                  {mutation.quantity}
                </TableCell>
                <TableCell className="text-center">
                  {mutation.senderWarehouse.name}
                </TableCell>
                <TableCell className="text-center">
                  {mutation.receiverWarehouse.name}
                </TableCell>
                <TableCell className="text-center">
                  {mutation.senderNotes || "No Notes"}
                </TableCell>
                <TableCell className="text-center">
                  {mutation.receiverNotes || "No Notes"}
                </TableCell>
                <TableCell className="text-center">{mutation.status}</TableCell>
                <TableCell className="text-center">
                  {getDate(mutation.createdAt!.toLocaleString())}
                </TableCell>
                <MutationAction mutation={mutation} manage="SEND" />
              </TableRow>
            ))}
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="text-center h-24">
              No Request
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default ManageMutationSend
