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
import { useAddCart } from "@/hooks/useCartMutation";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserContext from "@/context/UserContext";
import { useCartProduct } from "@/hooks/useCart";
import { useTranslation } from "react-i18next";

type WishlistItemProps = {
  product: Product;
};

const WishlistItem = ({ product }: WishlistItemProps) => {
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const isUserCartProducts =
    (user && user.userCart && user.userCart.cartProducts.length > 0) || false;
  const isProductInCart =
    isUserCartProducts &&
    user?.userCart.cartProducts.find(
      (cartProduct) => cartProduct.productId === product.id
    ) !== undefined;
  const { data: cartProduct } = useCartProduct(isProductInCart, product.id);

  const wishlistMutation = useDeleteWishlist();
  const toggleWishlist = useToggleWishlist();
  const cartMutation = useAddCart(product.id);
  const stock = product?.inventory
    ? product.inventory.reduce((prev, curr) => prev + curr.stock, 0)
    : 0;

  const addToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) {
      return navigate("/register");
    }
    if (user && stock > 0 && cartProduct && cartProduct.quantity < stock) {
      cartMutation.mutate({
        quantity: 1,
        productId: product.id,
        externalId: user.externalId,
      });
    }
  };

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
            <Button
              disabled={
                cartMutation.isPending ||
                stock <= 0 ||
                (cartProduct && cartProduct?.quantity >= stock)
              }
              onClick={addToCart}
              className="bg-black hover:bg-black/80 rounded-none  uppercase"
            >
              Add to cart
            </Button>
            {stock <= 0 && (
              <p className="text-primary text-xs">
                {t("wishlistPage.emptyStock")}
              </p>
            )}
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
