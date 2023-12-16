import { ProductData } from "@/hooks/useProduct";
import { cn, formatToIDR } from "@/lib/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReviewStar from "./ReviewStar";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/UserContext";
import { useCartProduct } from "@/hooks/useCart";
import { useAddCart } from "@/hooks/useCartMutation";
import { useReviewByProduct } from "@/hooks/useReview";
import { useToggleWishlist } from "@/hooks/useWishlistMutation";
import ProductSize from "./ProductSize";
import QuantityButton from "./QuantityButton";

type Props = {
  productData: ProductData;
};

const ProductDescription = ({ productData }: Props) => {
  const {
    product,
    totalSold,
    totalStock: totalAllStock,
    totalStockBySize,
  } = productData;
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
  const cartMutation = useAddCart();
  const toggleWishlist = useToggleWishlist();
  const [selectedProductSize, setSelectedProductSize] = useState<number | null>(
    totalStockBySize.length > 0 ? totalStockBySize[0].sizeId : null
  );
  const currentSizeStock = totalStockBySize.find(
    (size) => size.sizeId === selectedProductSize
  );
  const currentProductQtyInCart =
    cartProduct &&
    cartProduct.find((cart) => cart.sizeId === selectedProductSize)?.quantity;
  const totalStock = currentSizeStock?.total || 0;

  const addToCart = () => {
    if (!user) {
      return navigate("/register");
    }
    if (totalStock > 0 && selectedProductSize) {
      cartMutation.mutate({
        quantity,
        sizeId: selectedProductSize,
        productId: product.id,
        externalId: user.externalId,
      });
      setQuantity(1);
    }
  };

  useEffect(() => {
    const totalQuantity = (currentProductQtyInCart || 0) + quantity;
    if (quantity <= 0) {
      setError("This product(s) minimum quantity is 1 item(s)");
    } else if (
      totalStock &&
      (quantity > totalStock || totalQuantity > totalStock)
    ) {
      setError(`This product(s) maximum quantity is ${totalStock} item(s)`);
    }
  }, [currentProductQtyInCart, quantity, totalStock]);

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
        <h2 className="text-2xl lg:text-4xl font-bold leading-2">
          {product?.name}
        </h2>
        <div className="flex items-center justify-between my-4">
          <span className="lg:text-2xl font-bold">
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
          <div>
            <p className={cn("upercase", totalAllStock <= 0 && "text-primary")}>
              {totalStock > 0
                ? `${t("productDetailPage.options.stock")} ${totalAllStock}`
                : t("productDetailPage.options.noStock")}
            </p>
            <p className="uppercase text-muted-foreground text-sm">
              {t("productDetailPage.product.sold")}: {totalSold}
            </p>
          </div>
          <ProductSize
            selectedProductSize={selectedProductSize}
            setSelectedProductSize={setSelectedProductSize}
          />
          <QuantityButton
            price={product?.price || 0}
            totalStock={totalStock}
            currentProductQtyInCart={currentProductQtyInCart}
            error={error}
            quantity={quantity}
            setQuantity={setQuantity}
            inputRef={inputRef}
          />
          <Button
            disabled={
              totalStock <= 0 ||
              cartMutation.isPending ||
              (currentProductQtyInCart || 0) + quantity > totalStock
            }
            onClick={addToCart}
            className="rounded-none w-full uppercase font-semibold py-6"
          >
            {t("productDetailPage.options.addToCart")}
          </Button>

          {product.productWishlist.length <= 0 ? (
            <Button
              onClick={() => toggleWishlist.mutate({ productId: product.id })}
              variant="outline"
              className="rounded-none border-black w-full uppercase font-semibold"
            >
              {t("productDetailPage.options.addToWishlist")}
            </Button>
          ) : (
            <Button
              onClick={() => toggleWishlist.mutate({ productId: product.id })}
              variant="outline"
              className="rounded-none border-black w-full uppercase font-semibold"
            >
              {t("productDetailPage.options.removeFromWishlist")}
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
