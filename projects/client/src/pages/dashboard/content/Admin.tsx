import React, { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { SearchIcon, Plus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "react-router-dom"
import { useUsers } from "@/hooks/useUser"
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton"
import { useDebounce } from "use-debounce"
import { getDate } from "@/lib/utils"
import TablePagination from "../components/TablePagination"
import NewAdminFrom from "../components/NewAdminForm"
import AdminAction from "../components/AdminAction"
import ChangeOrderButton from "../components/ChangeOrderButton"

const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams({ page: "1" })
  const currentPage = Number(searchParams.get("page"))
  const [searchTerm, setSearchTerm] = useState("")
  const [debounceSearch] = useDebounce(searchTerm, 1000)

  const { data, isLoading, isFetched } = useUsers({
    page: currentPage,
    s: debounceSearch,
    r: "WAREHOUSE",
    filter: searchParams.get("filter") || "",
    order: searchParams.get("order") || "",
  })
  return (
    <div className="flex flex-col p-2 w-full">
      <Dialog>
        <DialogTrigger
          className={buttonVariants({
            variant: "default",
            className: "self-end",
          })}
        >
          <Plus className="w-4 h-4 mr-2" /> New Admin
        </DialogTrigger>
        <NewAdminFrom />
      </Dialog>
      <div className="relative w-[300px]">
        <SearchIcon className="absolute h-4 w-4 text-muted-foreground left-3 top-1/2 -translate-y-1/2" />
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchParams((params) => {
              params.set("s", e.target.value)
              return params
            })
            setSearchTerm(e.target.value)
          }}
          className=" w-full pl-10"
          placeholder="search product ..."
        />
      </div>
      <div className="border rounded-md mt-2">
        {isLoading ? (
          <ProductsPageSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>
                  <ChangeOrderButton paramKey="username" name="Name" />
                </TableHead>
                <TableHead>
                  <ChangeOrderButton paramKey="email" name="Email" />
                </TableHead>
                <TableHead className="text-center">
                  <ChangeOrderButton paramKey="status" name="Status" />
                </TableHead>
                <TableHead className="text-center">
                  <ChangeOrderButton paramKey="role" name="Role" />
                </TableHead>
                <TableHead className="text-center">
                  <ChangeOrderButton paramKey="createdAt" name="Created At" />
                </TableHead>
                <TableHead className="text-center">
                  <ChangeOrderButton paramKey="updatedAt" name="Updated At" />
                </TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetched && data?.users.length! > 0 ? (
                <>
                  {data?.users!.map((user, i) => (
                    <TableRow key={user.id}>
                      <TableCell className="w-[80px]">{i + 1}</TableCell>
                      <TableCell className="capitalize font-medium">
                        {user.firstname ? user.firstname : user.username}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button>{user.status}</Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button>{user.role}</Button>
                      </TableCell>
                      <TableCell className="text-center">
                        {getDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getDate(user.updatedAt)}
                      </TableCell>
                      <AdminAction user={user} />
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center h-24">
                    No Admins
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
          dataLength={data?.users.length!}
          totalPages={data?.totalPages!}
        />
      </div>
    </div>
  )
}

export default Admin
