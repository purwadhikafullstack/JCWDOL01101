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
import { Edit, MessagesSquare, Send } from "lucide-react";
import StockMutationModal from "./StockMutationModal";
import { useUser } from "@clerk/clerk-react";
import DeleteProductDialog from "./product/DeleteProductDialog";
import DeactivateProductDialog from "./product/DeactivateProductDialog";
import RestoreDropdownDialog from "./product/RestoreDropdownDialog";

const ProductDialog = ({ product }: { product: Product }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [params] = useSearchParams();
  const warehouseId = params.get("warehouse") || undefined;
  const { user } = useUser();
  const ROLE = user?.publicMetadata?.role;
  let isInventoryActive = false;
  for (const inv of product.inventory) {
    if (product.id === inv.productId && inv.status === "ACTIVE") {
      isInventoryActive = true;
    }
  }

  const handleDropdownChange = (open: boolean) => {
    if (open === false) {
      setDropdownOpen(false);
    }
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
                  <DeactivateProductDialog
                    dropdownChange={handleDropdownChange}
                    product={product}
                  />
                  <DeleteProductDialog
                    dropdownChange={handleDropdownChange}
                    product={product}
                  />
                </>
              )}
            </>
          ) : (
            <RestoreDropdownDialog
              dropdownChange={handleDropdownChange}
              product={product}
            />
          )}
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductDialog;
