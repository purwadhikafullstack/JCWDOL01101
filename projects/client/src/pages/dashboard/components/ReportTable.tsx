import React, { useEffect, useState } from "react";
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

function ReportTable({
  data,
   stockSummary
}: {
  data: { jurnals: Jurnal[]; totalPages: number, };
  stockSummary: { totalAddition: number; totalReduction: number; finalStock: number }; 
}) {
  const [totalAddition, setTotalAddition] = useState(0);
  const [totalReduction, setTotalReduction] = useState(0);
  const [finalStock, setFinalStock] = useState(0);

  useEffect(() => {
    let addition = 0;
    let reduction = 0;
    let stock = 0;

    if (data && data.jurnals) {
      data.jurnals.forEach((jurnal) => {
        if (jurnal.type === "1") {
          addition += jurnal.qtyChange;
        } else if (jurnal.type === "0") {
          reduction += jurnal.qtyChange;
        }
        stock += jurnal.newQty;
      });
    }

    setTotalAddition(addition);
    setTotalReduction(reduction);
    setFinalStock(stock);
  }, [data]);

  return (
    <>
      <div className="border text-center justify-evenly p-1">
        <p className="ml-12 font-bold">STOCK SUMMARY</p>
        <div className="flex justify-evenly text-center">
          <div className="flex bg-green-500 border-4 rounded-xl p-2 font-semibold">
            Total Penambahan : {totalAddition}
          </div>
          <div className="flex bg-red-400 p-2 border-4 rounded-xl font-semibold">
            Total Pengurangan : {totalReduction}
          </div>
          <div className="flex bg-blue-400 p-2 border-4 rounded-xl font-semibold">
            Stok Akhir : {finalStock}
          </div>
        </div>
      </div>
       {/* <div className="border text-center justify-evenly p-1">
        <p className="ml-12 font-bold">STOCK SUMMARY</p>
        <div className="flex justify-evenly text-center">
          <div className="flex bg-green-500 border-4 rounded-xl p-2 font-semibold">
            Total Penambahan : {stockSummary?.totalAddition}
          </div>
          <div className="flex bg-red-400 p-2 border-4 rounded-xl font-semibold">
            Total Pengurangan : {stockSummary?.totalReduction}
          </div>
          <div className="flex bg-blue-400 p-2 border-4 rounded-xl font-semibold">
            Stok Akhir : {stockSummary?.finalStock}
          </div>
        </div>
      </div> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">#</TableHead>
            <TableHead className=" text-center">Warehouse</TableHead>
            <TableHead className=" text-center">Product</TableHead>
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
                    {jurnal.jurnal?.sizes.label}
                  </TableCell>
                  <TableCell className="text-center">{jurnal.newQty}</TableCell>
                  <TableCell className="text-center">
                    {jurnal.qtyChange}
                  </TableCell>
                  <TableCell className="text-center">{jurnal.oldQty}</TableCell>
                  <TableCell className="text-center">{jurnal.type}</TableCell>
                  <TableCell className="text-center">{jurnal.notes}</TableCell>
                  <TableCell className="text-center">
                    {format(new Date(jurnal.createdAt), "Pp")}
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
