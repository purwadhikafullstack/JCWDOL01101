import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ChangeOrderButton from "./ChangeOrderButton";
import { Jurnal } from "@/hooks/useJurnal";
import { format } from "date-fns";
import { BadgeDollarSign, Boxes, LogIn, LogOut } from "lucide-react";
import { formatToIDR } from "@/lib/utils";

function ReportTable({
  data,
}: {
  data: {
    jurnals: Jurnal[];
    totalPages: number;
    totalAddition: number;
    totalReduction: number;
    finalStock: number;
    totalProductValue:number;
    productValue:number;
  };
}) {
  return (
    <>
      <div className="flex gap-4 justify-between py-4">
        {[
          { title: "Stock In", icon: LogIn, value: data.totalAddition },
          { title: "Stock Out", icon: LogOut, value: data.totalReduction },
          { title: "Current Stock", icon: Boxes, value: data.finalStock },
        ].map((stat) => (
          <div className="flex bg-background border rounded-lg p-4 shadow-sm flex-col w-full items-start">
            <div className="flex items-center gap-4">
              <span className="rounded-md p-2 inline-block">
                <stat.icon className="w-8 h-8 text-primary" />
              </span>
              <div>
                <p className="text-muted-foreground">{stat.title}</p>
                <p className="font-bold text-xl">{stat.value} pcs</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 justify-between py-4">
        {[
          { title: "Income Value", icon: BadgeDollarSign, value: data.totalProductValue }
        ].map((stat) => (
          <div className="flex bg-background border rounded-lg p-4 shadow-sm flex-col w-full items-start">
            <div className="flex items-center gap-4">
              <span className="rounded-md p-2 inline-block">
                <stat.icon className="w-8 h-8 text-primary" />
              </span>
              <div>
                <p className="text-muted-foreground">{stat.title}</p>
                <p className="font-bold text-xl">{formatToIDR(stat.value)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="">#</TableHead>
            <TableHead className=" text-center">Warehouse</TableHead>
            <TableHead className=" text-center">Product</TableHead>
            <TableHead className=" text-center">Category</TableHead>
            <TableHead className=" text-center">Size</TableHead>
            <TableHead className=" text-center">
              <ChangeOrderButton paramKey="newQty" name="newQty" />
            </TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="qtyChange" name="qtyChange" />
            </TableHead>
            <TableHead className="text-center">
              <ChangeOrderButton paramKey="oldQty" name="oldQty" />
            </TableHead>
            <TableHead className="text-center">type</TableHead>
            <TableHead className="text-center">notes</TableHead>
            <TableHead className="text-center">Date / Time</TableHead>
            <TableHead className="text-center">Income</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.jurnals && data.jurnals.length > 0 ? (
            <>
              {data?.jurnals!.map((jurnal, i) => (
                <TableRow key={jurnal.id}>
                  <TableCell className="w-[80px]">{i + 1}</TableCell>
                  <TableCell className="text-center">
                    {jurnal.jurnal?.warehouse.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {jurnal.jurnal?.product.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {jurnal.jurnal?.product.productCategory?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {jurnal.jurnal?.sizes.label}
                  </TableCell>
                  <TableCell className="text-center">{jurnal.newQty}</TableCell>
                  <TableCell className="text-center">
                    {jurnal.qtyChange}
                  </TableCell>
                  <TableCell className="text-center">{jurnal.oldQty}</TableCell>
                  <TableCell className="text-center">
                    {jurnal.type === "1" ? "Stock In" : "Stock Out"}
                  </TableCell>
                  <TableCell>{jurnal.notes}</TableCell>
                  <TableCell className="text-center">
                    {format(new Date(jurnal.createdAt), "Pp")}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatToIDR(jurnal.productValue ? `${jurnal.productValue}` : "-")}
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center h-24">
                No Reports
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default ReportTable;
