import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDate, formatToIDR } from "@/lib/utils";
import ChangeOrderButton from "./ChangeOrderButton";
import { Order } from "@/hooks/useOrder";
import { Jurnal } from "@/hooks/useJurnal";

function ReportTable({data}: {data: { jurnals: Jurnal[]; totalPages: number };}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">#</TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="inventoryId" name="inventoryId" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="oldQty" name="oldQty" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="qtyChange" name="qtyChange" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="newQty" name="newQty" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="type" name="type" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="notes" name="notes" />
          </TableHead>
          <TableHead className="text-center">
            <ChangeOrderButton paramKey="createdAt" name="Change Date" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.jurnals && data.jurnals.length > 0 ? (
          <>
            {data?.jurnals!.map((jurnal, i) => (
              <TableRow key={jurnal.id}>
                <TableCell className="w-[80px]">{i + 1}</TableCell>
                <TableCell className="capitalize font-medium text-center">
                  {jurnal.inventoryId}
                </TableCell>
                <TableCell className="text-center">{jurnal.oldQty}</TableCell>
                <TableCell className="text-center">
                  {jurnal.qtyChange}
                </TableCell>
                <TableCell className="text-center">{jurnal.newQty}</TableCell>
                <TableCell className="text-center">{jurnal.type}</TableCell>
                <TableCell className="text-center">{jurnal.notes}</TableCell>
              </TableRow>
            ))}
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="text-center h-24">
              No Stock Changed
            </TableCell>
          </TableRow>
        )}


      </TableBody>
    </Table>
  );
}

export default ReportTable;
