import React from "react"
import { SearchIcon, MapPin } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "react-router-dom"
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton"
import { useDebounce } from "use-debounce"
import TablePagination from "../components/TablePagination"
import { useUser } from "@clerk/clerk-react"
import { useGetWarehouse } from "@/hooks/useWarehouse"
import { useGetMutation } from "@/hooks/useMutation"
import { useCurrentUser } from "@/hooks/useUser"
import ManageMutationSend from "../components/warehouse/ManageMutationSend"
import ManageMutationReceive from "../components/warehouse/ManageMutationReceive"
import { cn } from "@/lib/utils"

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

  const { data: warehouses } = useGetWarehouse(ROLE === "ADMIN")
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
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2 ">
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
                <SelectValue placeholder="Select Mutation Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEND">Send</SelectItem>
                <SelectItem value="RECEIVE">receive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={cn(ROLE !== "ADMIN" && "hidden", "block self-end")}>
          {warehouses && warehouses.length > 0 && (
            <Select
              defaultValue="All"
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
                <SelectItem value="All">
                  <div className="flex items-center w-[300px] justify-between">
                    <span className="font-bold w-full self-start">All</span>
                    <span className="flex gap-2 text-center justify-end text-muted-foreground w-full">
                      All Warehouse
                      <MapPin className="w-4 h-4 mr-2" />
                    </span>
                  </div>
                </SelectItem>
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
      </div>
      <div className="border rounded-md mt-2">
        {isLoading ? (
          <ProductsPageSkeleton />
        ) : searchParams.get("manage") === "SEND" ? (
          <ManageMutationSend data={data!} />
        ) : (
          <ManageMutationReceive data={data!} />
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
