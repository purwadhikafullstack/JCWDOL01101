import React from "react"
import { buttonVariants } from "@/components/ui/button"
import { SearchIcon, Plus, MapPin } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Link, useSearchParams } from "react-router-dom"
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton"
import { useDebounce } from "use-debounce"
import { getDate } from "@/lib/utils"
import TablePagination from "../components/TablePagination"
import ChangeOrderButton from "../components/ChangeOrderButton"
import { useUser } from "@clerk/clerk-react"
import { useGetWarehouse } from "@/hooks/useWarehouse"
import { useGetMutation } from "@/hooks/useMutation"
import { useCurrentUser } from "@/hooks/useUser"
import MutationAction from "../components/warehouse/MutationAction"

function ManageMutation() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { data: userAdmin } = useCurrentUser({
    externalId: user?.id!,
    enabled: isLoaded && !!isSignedIn,
  })
  const ROLE = userAdmin?.role || "CUSTOMER"
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  })
  const currentPage = Number(searchParams.get("page"))
  const searchTerm = searchParams.get("s") || ""
  const [debounceSearch] = useDebounce(searchTerm, 1000)

  const { data: warehouses } = useGetWarehouse()
  const { data, isLoading } = useGetMutation({
    page: currentPage,
    s: debounceSearch,
    filter: searchParams.get("filter") || "",
    order: searchParams.get("order") || "",
    limit: 10,
    warehouse:
      userAdmin?.userData?.name ||
      searchParams.get("warehouse") ||
      (warehouses && warehouses[0].name)!,
    manage: searchParams.get("manage") || "SEND",
  })
  return (
    <div className="flex flex-col p-2 w-full">
      <Link
        to="/dashboard/mutation-form"
        className={buttonVariants({
          variant: "default",
          className: "self-end",
        })}
      >
        <Plus className="w-4 h-4 mr-2" /> New Mutation
      </Link>
      <div className="flex gap-2 items-center w-full">
        <div className="relative w-[300px]">
          <SearchIcon className="absolute h-4 w-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchParams((params) => {
                params.set("s", e.target.value)
                return params
              })
            }}
            className=" w-full pl-10"
            placeholder="search product ..."
          />
        </div>
        <div className="w-[100px]">
          <Select
            defaultValue={"SEND"}
            onValueChange={(value) => {
              setSearchParams((params) => {
                params.set("manage", value)
                return params
              })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEND">Send</SelectItem>
              <SelectItem value="RECEIVE">receive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {ROLE === "ADMIN" && (
          <div className="flex gap-2 items-center">
            {warehouses && warehouses.length > 0 && (
              <Select
                defaultValue={(warehouses && warehouses[0].name) || ""}
                onValueChange={(value) => {
                  setSearchParams((params) => {
                    params.set("warehouse", value)
                    return params
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.name}>
                      <div className="flex items-center w-[300px] justify-between">
                        <span className="font-bold w-full self-start">
                          {warehouse.name}
                        </span>
                        <span className="flex gap-2 text-center justify-end text-muted-foreground w-full">
                          {warehouse.warehouseAddress?.cityWarehouse?.cityName}
                          <MapPin className="w-4 h-4 mr-2" />
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
      <div className="border rounded-md mt-2">
        {isLoading ? (
          <ProductsPageSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead className="text-center">
                  <ChangeOrderButton paramKey="product" name="Product Name" />
                </TableHead>
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
                    name="To Warehouse"
                  />
                </TableHead>
                <TableHead className="text-center">
                  <ChangeOrderButton
                    paramKey="senderNotes"
                    name="Request Notes"
                  />
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
                        {mutation.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        {mutation.senderWarehouse.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {mutation.receiverWarehouse.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {mutation.senderNotes}
                      </TableCell>
                      <TableCell className="text-center">
                        {mutation.receiverNotes || "No Notes"}
                      </TableCell>
                      <TableCell className="text-center">
                        {mutation.status}
                      </TableCell>
                      <TableCell className="text-center">
                        {getDate(mutation.createdAt!.toLocaleString())}
                      </TableCell>
                      <MutationAction
                        mutationId={mutation.id!}
                        manage={searchParams.get("manage") || "SEND"}
                      />
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
        )}
      </div>
      <div className="flex gap-2 items-center justify-end mt-4">
        <TablePagination
          currentPage={currentPage}
          dataLength={data?.mutations.length!}
          totalPages={data?.totalPages!}
        />
      </div>
    </div>
  )
}

export default ManageMutation
