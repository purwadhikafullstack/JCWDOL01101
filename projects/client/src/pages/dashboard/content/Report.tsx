import React from "react"
import { useUser } from "@clerk/clerk-react"
import { useCurrentUser } from "@/hooks/useUser"
import { getAllJurnals } from "@/hooks/useJurnal"
import { CalendarIcon, MapPin, SearchIcon } from "lucide-react"
import { format, subDays } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebounce } from "use-debounce"
import { useSearchParams } from "react-router-dom"
import { useGetWarehouse } from "@/hooks/useWarehouse"
import TablePagination from "../components/TablePagination"
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton"
import ReportTable from "../components/ReportTable"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Hashids from "hashids"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { Helmet } from "react-helmet"
const Report = () => {
  const hashids = new Hashids("TOTEN", 10)
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
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const { data: warehouses } = useGetWarehouse(ROLE === "ADMIN")
  const { data, isLoading } = getAllJurnals({
    page: currentPage,
    s: debounceSearch,
    filter: searchParams.get("filter") || "",
    order: searchParams.get("order") || "",
    limit: 10,
    warehouse: searchParams.get("warehouse") || "",
    to: date?.to,
    from: date?.from,
  })

  const handleSelectDate = (e: DateRange | undefined) => {
    setDate(e)
    setSearchParams((params) => {
      params.set("from", String(e?.from))
      params.set("to", String(e?.to))
      return params
    })
  }
  const jurnals = data?.data.jurnals || []
  return (
    <>
      <Helmet>
        <title>Dashboard | Reports</title>
      </Helmet>
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
                placeholder="search product..."
              />
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
                defaultValue="ALL"
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
                  <SelectItem value="ALL">
                    <div className="flex items-center w-[300px] justify-between">
                      <span className="font-bold w-full self-start">All</span>
                      <span className="flex gap-2 text-center justify-end text-muted-foreground w-full">
                        All Warehouse
                        <MapPin className="w-4 h-4 mr-2" />
                      </span>
                    </div>
                  </SelectItem>
                  {warehouses.map((warehouse) => {
                    const hashWarehouseId = hashids.encode(warehouse.id)
                    return (
                      <SelectItem key={warehouse.id} value={hashWarehouseId}>
                        <div className="flex items-center w-[300px] justify-between">
                          <span className="font-bold w-full self-start">
                            {warehouse.name}
                          </span>
                          <span className="flex gap-2 text-center justify-end text-muted-foreground w-full">
                            {
                              warehouse.warehouseAddress?.cityWarehouse
                                ?.cityName
                            }
                            <MapPin className="w-4 h-4 mr-2" />
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <div className="mt-2">
          {isLoading ? (
            <ProductsPageSkeleton />
          ) : (
            <ReportTable
              data={{
                jurnals,
                totalPages: data?.data.totalPages || 0,
                totalAddition: data?.data.totalAddition || 0,
                totalReduction: data?.data.totalReduction || 0,
                finalStock: data?.data.finalStock || 0,
              }}
            />
          )}
        </div>
        <div className="flex gap-2 items-center justify-end mt-4">
          <TablePagination
            currentPage={currentPage}
            dataLength={data?.data.jurnals.length!}
            totalPages={data?.data.totalPages!}
          />
        </div>
      </div>
    </>
  )
}
export default Report
