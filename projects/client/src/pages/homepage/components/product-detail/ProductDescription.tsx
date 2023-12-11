import { Product } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReviewStar from "./ReviewStar";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserContext from "@/context/UserContext";
import { useCartProduct } from "@/hooks/useCart";
import { useAddCart } from "@/hooks/useCartMutation";
import { useReviewByProduct } from "@/hooks/useReview";
import { useToggleWishlist } from "@/hooks/useWishlistMutation";

type ProductDescriptionProps = {
  product: Product;
  totalStock: number;
  totalSold: number;
};

const ProductDescription = ({
  product,
  totalSold,
  totalStock,
}: ProductDescriptionProps) => {
  const { t } = useTranslation();


  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUser must be used within a UserProvider");
  }
  const { user } = userContext;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const isUserCartProducts =
    (user?.userCart && user?.userCart.cartProducts.length > 0) || false;
  const isProductInCart =
    isUserCartProducts &&
    user?.userCart.cartProducts.find(
      (cartProduct) => cartProduct.productId === product.id
    ) !== undefined;
  const { data: cartProduct } = useCartProduct(isProductInCart, product.id);
  const { data: reviewData } = useReviewByProduct(product?.id);
  const cartMutation = useAddCart(cartProduct?.productId);
  const toggleWishlist = useToggleWishlist();

  const addToCart = () => {
    if (!user) {
      return navigate("/register");
    }
    if (totalStock > 0) {
      cartMutation.mutate({
        quantity,
        productId: product.id,
        externalId: user.externalId,
      });
      setQuantity(1);
    }
  };

  useEffect(() => {
    const totalQuantity = (cartProduct?.quantity || 0) + quantity;

    if (quantity <= 0) {
      setError("This product(s) minimum quantity is 1 item(s)");
    } else if (
      totalStock &&
      (quantity > totalStock || totalQuantity > totalStock)
    ) {
      setError(`This product(s) maximum quantity is ${totalStock} item(s)`);
    }
  }, [cartProduct?.quantity, quantity, totalStock]);

  useEffect(() => {
    function handleClickOuside(event: MouseEvent) {
      if (
        error &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setError("");
        setQuantity(1);
      }
    }
    document.addEventListener("mousedown", handleClickOuside);
    return () => {
      document.removeEventListener("mousedown", handleClickOuside);
    };
  }, [inputRef, error]);
  return (
    <div className="sticky top-[100px]">
      <div className="w-full h-full">
        <h2 className="text-4xl font-bold leading-2">{product?.name}</h2>
        <div className="flex items-center justify-between my-4">
          <span className="text-2xl font-bold">
            {formatToIDR(product?.price || 0)}
          </span>
          {reviewData && (
            <div className="flex gap-2 items-center">
              <ReviewStar rating={reviewData.averageRating} />
              <Link
                to={`/product/${product?.slug}/reviews`}
                className="underline"
              >
                ({reviewData.totalReviews || 0})
              </Link>
            </div>
          )}
        </div>
        <p>{product?.description}</p>
        <Separator className="my-2 mt-6" />
        <div className="space-y-4">
          <span className="uppercase font-semibold">Size: {product?.size}</span>
          <div>
            <p className={`${totalStock <= 0 && "text-primary"} uppercase`}>
              {totalStock > 0
                ? `${t("productDetailPage.options.stock")} ${totalStock}`
                : t("productDetailPage.options.noStock")}
            </p>
            <p className="uppercase text-muted-foreground text-sm">
              {t("productDetailPage.product.sold")}: {totalSold}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex gap-2">
                <Button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="bg-black hover:bg-black/80 rounded-none"
                >
                  <Minus />
                </Button>
                <Input
                  disabled={totalStock <= 0}
                  ref={inputRef}
                  value={quantity}
                  onChange={(e) => {
                    if (quantity >= 0) {
                      const numericValue = e.target.value
                        .trim()
                        .replace(/\D/g, "");
                      setQuantity(Number(numericValue));
                    }
                  }}
                  className="rounded-none text-lg focus-visible:ring-black outline-none text-center"
                />
                <Button
                  disabled={
                    (cartProduct?.quantity || 0) >= totalStock ||
                    totalStock <= 0
                  }
                  onClick={() => {
                    if (quantity < totalStock) {
                      setQuantity(quantity + 1);
                    }
                  }}
                  className="bg-black hover:bg-black/80 rounded-none"
                >
                  <Plus />
                </Button>
              </div>
              <p className="text-primary text-xs mt-2">{error}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="">Subtotal</span>
              <p className="font-bold">
                {formatToIDR(product.price * quantity || 0)}
              </p>
            </div>
          </div>
          <Button
            disabled={
              totalStock <= 0 ||
              cartMutation.isPending ||
              (cartProduct?.quantity || 0) + quantity > totalStock
            }
            onClick={addToCart}
            className="rounded-none w-full uppercase font-semibold py-6"
          >
            Add to cart
          </Button>

          {product.productWishlist.length <= 0 ? (
            <Button
              onClick={() => toggleWishlist.mutate({ productId: product.id })}
              variant="outline"
              className="rounded-none border-black w-full uppercase font-semibold"
            >
              add to wishlist
            </Button>
          ) : (
            <Button
              onClick={() => toggleWishlist.mutate({ productId: product.id })}
              variant="outline"
              className="rounded-none border-black w-full uppercase font-semibold"
            >
              remove from wishlist
            </Button>
          )}
          <div className="mt-4">
            <img src="/carousel/1.jpg" alt="advertise" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
