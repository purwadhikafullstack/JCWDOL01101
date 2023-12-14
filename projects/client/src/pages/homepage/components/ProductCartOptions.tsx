import { Minus, Plus } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAddCart } from "@/hooks/useCartMutation";
import UserContext from "@/context/UserContext";
import { formatToIDR } from "@/lib/utils";
import { useCartProduct } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductCartOptions = ({
  price,
  productId,
  totalStock,
}: {
  price: number;
  productId: number;
  totalStock: number;
}) => {
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
      (cartProduct) => cartProduct.productId === productId
    ) !== undefined;
  const { data: cartProduct } = useCartProduct(isProductInCart, productId);
  const cartMutation = useAddCart(cartProduct?.productId);

  const addToCart = () => {
    if (!user) {
      return navigate("/register");
    }
    if (totalStock > 0) {
      cartMutation.mutate({
        quantity,
        productId,
        externalId: user?.externalId as string,
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
    <div className="w-full  variant-options">
      <div className="sticky top-[100px]">
        <div className="w-full h-full border rounded-md p-2 pb-6 space-y-2">
          <p className="font-bold text-sm">
            {t("productDetailPage.options.header")}
          </p>
          <div className="flex justify-between items-center">
            <div className="border rounded-md px-1 flex items-center border-primary select-none">
              <Button
                disabled={quantity <= 1}
                onClick={() => setQuantity(quantity - 1)}
                variant="ghost"
                className="p-0 px-2 w-full"
              >
                <Minus className="w-4 h-4 text-primary cursor-pointer" />
              </Button>
              <input
                ref={inputRef}
                className="w-[40px] px-2 active:outline-none text-center"
                value={quantity}
                onChange={(e) => {
                  if (quantity >= 0) {
                    setQuantity(Number(e.target.value));
                  }
                }}
              />
              <Button
                disabled={quantity === totalStock}
                onClick={() => {
                  if (quantity < totalStock) {
                    setQuantity(quantity + 1);
                  }
                }}
                variant="ghost"
                className="p-0 px-2 w-full"
              >
                <Plus className="w-4 h-4 text-primary cursor-pointer" />
              </Button>
            </div>
            <p className={`${totalStock <= 0 && "text-primary/80"} text-sm`}>
              {totalStock > 0
                ? `${t("productDetailPage.options.stock")} ${totalStock}`
                : t("productDetailPage.options.noStock")}
            </p>
          </div>
          <p className="text-primary text-xs">{error}</p>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm ">
              {t("productDetailPage.options.subTotal")}
            </p>
            <p className="font-bold ">
              {formatToIDR((price * quantity).toString())}
            </p>
          </div>
          <Button
            disabled={
              totalStock <= 0 ||
              cartMutation.isPending ||
              (cartProduct?.quantity || 0) + quantity > totalStock
            }
            onClick={addToCart}
            className="w-full select-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("productDetailPage.options.btn")}
          </Button>
        </div>
        <div className="mt-4">
          <img className="rounded-md" src="/carousel/1.jpg" alt="advertise" />
        </div>
      </div>
    </div>
  );
};

export default ProductCartOptions;
