import React from "react"
import { SearchIcon, MapPin, CalendarIcon } from "lucide-react"
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
import { useCurrentUser } from "@/hooks/useUser"
import { getAllOrders } from "@/hooks/useOrder"
import OrderTable from "../components/OrderTable"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { addDays, format, subDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"

const DashboardOrder = () => {
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

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(),30),
    to: new Date(),
  });
  
  const { data: warehouses } = useGetWarehouse(ROLE === "ADMIN")
  const { data, isLoading } = getAllOrders({
    page: currentPage,
    s: debounceSearch,
    filter: searchParams.get("filter") || "",
    order: searchParams.get("order") || "",
    limit: 10,
    warehouse:
      userAdmin?.userData?.name ||
      searchParams.get("warehouse") ||
      (warehouses && warehouses[0].name) ||
      "",
    status: searchParams.get("status") || "",
    to:   date?.to,
    from:  date?.from,
  })

  const handleSelectDate = (e: DateRange | undefined) => {
    setDate(e);
    setSearchParams((params) => {
      params.set("from", String(e?.from));
      params.set("to", String(e?.to));
      return params;
    });
  };

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
              placeholder="search order..."
            />
          </div>
          <div className="flex justify-end">
            <Select
              onValueChange={(value) => {
                setSearchParams((params) => {
                  params.set("status", value)
                  return params
                })
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="WAITING">Waiting</SelectItem>
                <SelectItem value="PROCESS">Process</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="UNSUCCESSFUL">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")}-{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleSelectDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
        </div>
        <div
          className={cn(
            ROLE !== "ADMIN" && "hidden",
            "flex gap-2 items-center"
          )}
        >
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
        {isLoading ? <ProductsPageSkeleton /> : <OrderTable data={data!} />}
      </div>
      <div className="flex gap-2 items-center justify-end mt-4">
        <TablePagination
          currentPage={currentPage}
          dataLength={data?.orders.length!}
          totalPages={data?.totalPages!}
        />
      </div>
    </div>
  )
}

export default DashboardOrder
