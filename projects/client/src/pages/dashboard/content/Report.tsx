import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useCurrentUser } from "@/hooks/useUser";
import { getAllJurnals, useGetJurnal } from "@/hooks/useJurnal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ChangeOrderButton from "../components/ChangeOrderButton";
import { Loader2, MapPin } from "lucide-react";
import service from "@/service";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

type JurnalType = {
  id: number;
  jurnal?: InventoryType;
  oldQty: number;
  qtyChange: number;
  newQty: number;
  type: string;
  notes: string;
  createdAt:string;
};

type InventoryType = {
  inventoryId: number;
  warehouse: WarehouseType;
  sizes: SizeType;
  status: string;
  product: ProductType;
  stock: number;
  sold: number;
};

type WarehouseType = {
  warehouseId: number;
  name: string;
};

type SizeType = {
  sizeId: number;
  label: string;
  value: number;
};

type ProductType = {
  productId: number;
  name: string;
};

const Report = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const ROLE = user?.publicMetadata.role || "CUSTOMER";
  const { data: curentUser } = useCurrentUser({
    externalId: user?.id,
    enabled: isLoaded && !!isSignedIn,
  });

  const { data: jurnals, isLoading, isError } = useGetJurnal(ROLE === "ADMIN");

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }


    // const { data: jurnals, isError, isLoading } = useGetJurnal(true);

    // if (isLoading) {
    //   return <div>Loading...</div>;
    // }

    // if (isError) {
    //   return <div>Error!</div>;
    // }

    // const [jurnals, setJurnals] = useState<JurnalType[]>([]);

    // useEffect(() => {
    //   service
    //     .get("/jurnals")
    //     .then((response) => {
    //       if (Array.isArray(response.data.data)) {
    //         setJurnals(response.data.data);
    //         console.log(response.data.data);
    //       } else {
    //         console.error("Data is not an array:", response.data.data);
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("There was an error!", error);
    //     });
    // }, []);

  return (
    <>
      <div className="border border-black w-1/4">
        <div>Rincian</div>
        <div className="flex">Total</div>
      </div>
      
      <div className="flex flex-col p-2 w-full">
        <div className="border rounded-md mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">#</TableHead>
                <TableHead className=" text-center">
                  <ChangeOrderButton paramKey="warehouse" name="Warehouse" />
                </TableHead>
                <TableHead className=" text-center">
                  <ChangeOrderButton paramKey="product" name="Product" />
                </TableHead>
                <TableHead className=" text-center">
                  <ChangeOrderButton paramKey="size" name="Size" />
                </TableHead>
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
              {jurnals &&
                jurnals.map((jurnal) => (
                  <TableRow key={jurnal.id}>
                    <TableCell className="text-center">{jurnal.id}</TableCell>
                    <TableCell className="text-center">
                      {jurnal.jurnal?.warehouse.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {jurnal.jurnal?.product.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {jurnal.jurnal?.sizes.label}
                    </TableCell>
                    <TableCell className="text-center">
                      {jurnal.newQty}
                    </TableCell>
                    <TableCell className="text-center">
                      {jurnal.qtyChange}
                    </TableCell>
                    <TableCell className="text-center">
                      {jurnal.oldQty}
                    </TableCell>
                    <TableCell className="text-center">{jurnal.type}</TableCell>
                    <TableCell className="text-center">
                    {jurnal.notes}
                    </TableCell>
                    <TableCell className="text-center">
                      {format(new Date(jurnal.createdAt),"Pp")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {/* <div className="flex gap-2 items-center justify-end mt-4">
          <TablePagination
            currentPage={currentPage}
            dataLength={data?.products.length!}
            totalPages={data?.totalPages!}
          />
        </div> */}
      </div>
    </>
  );
};
export default Report;
