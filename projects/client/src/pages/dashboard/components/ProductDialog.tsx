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
import { DotsHorizontalIcon, ValueNoneIcon } from "@radix-ui/react-icons";
import { Link, useSearchParams } from "react-router-dom";
import DeleteProduct from "./product/DeleteProduct";
import { Product } from "@/hooks/useProduct";
import { ArchiveRestore, Delete, Edit, MessagesSquare } from "lucide-react";
import StockMutationModal from "./StockMutationModal";
import {
  useChangeStatus,
  useChangeStatusInventory,
} from "@/hooks/useProductMutation";
import { STATUS } from "@/hooks/useReviewMutation";

const ProductDialog = ({ product }: { product: Product }) => {
  let isInventoryActive = false;
  for (const inv of product.inventory) {
    if (product.id === inv.productId && inv.status === "ACTIVE") {
      isInventoryActive = true;
    }
  }

  const [params] = useSearchParams();
  const warehouseId = Number(params.get("warehouse")) || undefined;
  const status = (String(params.get("status")) as STATUS) || "";
  const changeStatusMutation = useChangeStatus();
  const changeProductInventory = useChangeStatusInventory();
  const handleRestoreProduct = () => {
    if (product.id && status) {
      changeStatusMutation.mutate({
        warehouseId,
        productId: product.id,
        status: "ACTIVE",
        previousStatus: status,
      });
    }
  };
  const handleDeactivatedProduct = () => {
    if (product.id && warehouseId) {
      changeProductInventory.mutate({
        warehouseId,
        productId: product.id,
        status: "DEACTIVATED",
      });
    }
  };
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
          <DotsHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <>
            {isInventoryActive ? (
              <>
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
                <StockMutationModal product={product} />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeactivatedProduct}
                  className="w-full cursor-pointer text-muted-foreground"
                >
                  <ValueNoneIcon className="mr-2" />
                  Deactivated
                </DropdownMenuItem>
                <DialogTrigger className="w-full">
                  <DropdownMenuItem className="w-full cursor-pointer text-muted-foreground">
                    <Delete className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSeparator />
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onClick={handleRestoreProduct}
                  className="w-full cursor-pointer text-muted-foreground"
                >
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  Restore
                </DropdownMenuItem>
              </>
            )}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">
            Are you sure deleting {product.name} ?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            product and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-col w-full space-y-2">
            <DeleteProduct productId={Number(product.id)} />
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
