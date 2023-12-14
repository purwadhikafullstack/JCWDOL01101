import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import DeleteProduct from "./product/DeleteProduct";
import { Product } from "@/hooks/useProduct";
import { Delete, Edit, MessagesSquare } from "lucide-react";
const ProductDialog = ({ product }: { product: Product }) => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
          <DotsHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link to={`/dashboard/product/edit/${product.slug}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2 text-muted-foreground" />
              Edit
            </DropdownMenuItem>
          </Link>
          <Link to={`/dashboard/product/reviews/${product.slug}`}>
            <DropdownMenuItem className="cursor-pointer">
              <MessagesSquare className="w-4 h-4 mr-2 text-muted-foreground" />
              Reviews
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DialogTrigger className="w-full">
            <DropdownMenuItem className="w-full cursor-pointer text-muted-foreground">
              <Delete className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure deleting {product.name} ?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            product and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DeleteProduct productId={Number(product.id)} />
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
