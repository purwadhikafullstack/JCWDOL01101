import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link, useSearchParams } from "react-router-dom";
import { Product } from "@/hooks/useProduct";
import { ArchiveRestore, Edit, MessagesSquare, Send } from "lucide-react";
import StockMutationModal from "./StockMutationModal";
import { useChangeStatus } from "@/hooks/useProductMutation";
import { STATUS } from "@/hooks/useReviewMutation";
import { useUser } from "@clerk/clerk-react";
import DeleteProductDialog from "./product/DeleteProductDialog";
import DeactivateProductDialog from "./product/DeactivateProductDialog";

const ProductDialog = ({ product }: { product: Product }) => {
  const [params] = useSearchParams();
  const warehouseId = params.get("warehouse") || undefined;
  const status = (String(params.get("status")) as STATUS) || "";
  const changeStatusMutation = useChangeStatus();
  const { user } = useUser();
  const ROLE = user?.publicMetadata?.role;
  let isInventoryActive = false;
  for (const inv of product.inventory) {
    if (product.id === inv.productId && inv.status === "ACTIVE") {
      isInventoryActive = true;
    }
  }
  const handleRestoreProduct = () => {
    if (product.id && status && warehouseId) {
      changeStatusMutation.mutate({
        warehouseId,
        productId: product.id,
        status: "ACTIVE",
        previousStatus: status,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <>
          {isInventoryActive ? (
            <>
              <Link to={`/dashboard/product/reviews/${product.slug}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <MessagesSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                  Reviews
                </DropdownMenuItem>
              </Link>
              <StockMutationModal product={product} />
              <Link
                to={`/dashboard/mutation-form/${product.slug}?warehouse=${warehouseId}`}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <Send className="w-4 h-4 mr-2 text-muted-foreground" />
                  Request Stock
                </DropdownMenuItem>
              </Link>
              {ROLE === "ADMIN" && (
                <>
                  <Link to={`/dashboard/product/edit/${product.slug}`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="w-4 h-4 mr-2 text-muted-foreground" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DeactivateProductDialog product={product} />
                  <DeleteProductDialog product={product} />
                </>
              )}
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
  );
};

export default ProductDialog;
