import React from "react"
import { useCategories } from "@/hooks/useCategory"
import { useDeleteCategoryMutation } from "@/hooks/useCategoryMutation"
import AddCategoryForm from "../components/category/AddCategoryForm"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { baseURL } from "@/service"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants, Button } from "@/components/ui/button"
import { DialogHeader, DialogFooter } from "@/components/ui/custom-dialog"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Link, useSearchParams } from "react-router-dom"
import EditCategoryForm from "../components/category/EditCategoryForm"
import { Loader2 } from "lucide-react"
import { Helmet } from "react-helmet"

export default function ManageCategory() {
  const { data: categoriess } = useCategories()
  const [searchParams, setSearchParams] = useSearchParams()
  const slug = searchParams.get("slug") || ""
  const edit = !!searchParams.get("edit") || false
  const deleteCategoryMutation = useDeleteCategoryMutation()

  return (
    <div>
      <Helmet>
        <title>Dashboard | Categories</title>
      </Helmet>
      <div className="flex w-full gap-4">
        <div className="w-full space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriess &&
                categoriess.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <img
                        src={`${baseURL}/images/${category.image}`}
                        className="w-[80px]"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className={buttonVariants({ variant: "ghost" })}
                          >
                            <DotsHorizontalIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <Link
                              to={`/dashboard/product/category?slug=${category.slug}&edit=true`}
                            >
                              <DropdownMenuItem className="cursor-pointer">
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DialogTrigger className="w-full">
                              <DropdownMenuItem className="w-full cursor-pointer">
                                Delete
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Are you sure deleting {category.name} ?
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your category and remove your
                              data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={() => {
                                setSearchParams((params) => {
                                  params.delete("slug")
                                  params.delete("edit")
                                  return params
                                })
                                deleteCategoryMutation.mutate(category.id)
                              }}
                              type="button"
                            >
                              {deleteCategoryMutation.isPending && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              )}
                              Yes, Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="border h-max w-full p-4 sticky top-[120px]">
          <div className="flex gap-2 items-center mb-8">
            <p className="font-bold">{edit ? "Edit" : "Add"} Category</p>
          </div>

          {edit ? <EditCategoryForm /> : <AddCategoryForm />}
        </div>
      </div>
    </div>
  )
}
