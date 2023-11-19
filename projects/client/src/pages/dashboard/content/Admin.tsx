import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, SearchIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { useSearchParams } from "react-router-dom"
import { useUsers } from "@/hooks/useUser"
import ProductsPageSkeleton from "@/components/skeleton/ProductsPageSkeleton"
import { useDebounce } from "use-debounce"
import { getDate } from "@/lib/utils"

const Admin = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1
  const [searchTerm, setSearchTerm] = useState("")
  const [debounceSearch] = useDebounce(searchTerm, 1000)

  const { data, isLoading, isFetched } = useUsers({
    page: currentPage,
    s: debounceSearch,
    r: "WAREHOUSE",
  })
  return (
    <div className="flex flex-col p-2 w-full">
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
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetched && data?.users.length! > 0 ? (
                <>
                  {data?.users!.map((user, i) => (
                    <TableRow key={user.id}>
                      <TableCell className="w-[80px]">{i + 1}</TableCell>
                      <TableCell className="font-medium">
                        {user.firstname} {user.lastname}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button>{user.status}</Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button>{user.role}</Button>
                      </TableCell>
                      <TableCell>{getDate(user.createdAt)}</TableCell>
                      <TableCell>{getDate(user.updatedAt)}</TableCell>
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
        <div className="flex gap-2 items-center">
          <p className="text-sm">
            Page {currentPage} of {data?.totalPages || 0}
          </p>
          <Button
            disabled={currentPage <= 1}
            onClick={() => {
              setSearchParams((params) => {
                if (currentPage > 1) {
                  params.set("page", (currentPage - 1).toString())
                }
                return params
              })
            }}
            variant="outline"
          >
            <ChevronLeft />
          </Button>
          <Button
            disabled={isFetched ? data?.users.length! !== 10 : false}
            onClick={() => {
              setSearchParams((params) => {
                params.set("page", (currentPage + 1).toString())
                return params
              })
            }}
            variant="outline"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Admin
