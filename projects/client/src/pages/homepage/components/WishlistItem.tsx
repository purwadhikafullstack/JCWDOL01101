import React, { MouseEvent, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { Separator } from "@/components/ui/separator";
import { Heart, X } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  useDeleteWishlist,
  useToggleWishlist,
} from "@/hooks/useWishlistMutation";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type WishlistItemProps = {
  product: Product;
};

const WishlistItem = ({ product }: WishlistItemProps) => {
  const { t } = useTranslation();

  const wishlistMutation = useDeleteWishlist();
  const toggleWishlist = useToggleWishlist();

  useEffect(() => {
    if (wishlistMutation.isSuccess) {
      toast(
        (to) => (
          <div className="bg-black text-background  flex gap-2">
            <span className="text-sm">
              {t("wishlistPage.successRemoveModal")}
            </span>
            <button
              onClick={() => {
                toast.dismiss(to.id);
                toggleWishlist.mutate({ productId: product.id });
              }}
              className="ml-2 bg-black/50 px-2 py-1 rounded-md"
            >
              cancel
            </button>
          </div>
        ),
        {
          style: {
            width: "max-content",
            padding: 1,
            background: "#000",
          },
          duration: 2000,
        }
      );
    }
  }, [wishlistMutation.isSuccess, product.id]);
  return (
    <Link to={`/product/${product.slug}`}>
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div className="flex gap-6 order-2 lg:order-1">
          <div className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] relative">
            <span className="absolute top-0 right-0 p-2">
              <Heart fill="#e11d48" className="text-primary" />
            </span>
            <LazyLoadImage
              src={`${baseURL}/images/${product.primaryImage}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <p className="font-bold">{product.name}</p>
            <p className="max-w-[50%] text-muted-foreground text-sm hidden lg:block">
              {product.description}
            </p>
            <p className="hidden lg:block">Size: {product.size}</p>
            <p className="font-bold text-lg">{formatToIDR(product.price)}</p>
          </div>
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            wishlistMutation.mutate({ productId: product.id });
          }}
          variant="outline"
          className="border-black rounded-none h-6 px-0 self-end lg:self-start mb-2 lg:mb-0 order-1 lg:order-2"
        >
          <X />
        </Button>
      </div>
      <Separator className="my-6" />
    </Link>
  );
};

export default WishlistItem;
