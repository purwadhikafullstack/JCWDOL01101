import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartProductOnSize } from "@/hooks/useCart";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
import { Minus, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  useCancelCartProductDeletion,
  useChageQty,
  useDeleteCartProduct,
  useToggleSelectedProduct,
} from "@/hooks/useCartMutation";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { cartProducts } from "@/context/UserContext";
import { useDebounce } from "use-debounce";
import useOutsideClick from "@/hooks/useClickOutside";

type CartItemProps = {
  hasCart: boolean;
  cartProduct: cartProducts;
};

const CartItem = ({ hasCart, cartProduct }: CartItemProps) => {
  const { product, cartId, id, quantity, selected, size, sizeId } = cartProduct;
  const { t } = useTranslation();
  const { data: cp } = useCartProductOnSize(hasCart, product.id, sizeId);
  const stock = cp?.stock || 0;

  const deleteMutation = useDeleteCartProduct();
  const cancelDeleteMutation = useCancelCartProductDeletion();
  const toggleSelectedCart = useToggleSelectedProduct(id, product.id!);
  const [quantityChange, setQuantityChange] = React.useState(0);
  const [inputQuantity, setInputQuantity] = React.useState(quantity);
  const [debouncedInputQuantity] = useDebounce(inputQuantity, 1000);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const quantityChangeRef = React.useRef(quantityChange);
  const qtyMutation = useChageQty();

  React.useEffect(() => {
    setInputQuantity(quantity);
  }, [quantity]);

  React.useEffect(() => {
    quantityChangeRef.current = quantityChange;
  }, [quantityChange]);

  const debouncedQtyMutation = React.useCallback(
    debounce(() => {
      if (cp && product.id && quantityChangeRef.current !== 0) {
        const newQuantity = Math.max(
          1,
          Math.min(cp.stock, quantity + quantityChangeRef.current)
        );
        qtyMutation.mutate({
          cartId,
          sizeId: size.id,
          productId: product.id,
          qty: newQuantity,
        });
        setQuantityChange(0);
      }
    }, 300),
    [qtyMutation.mutate, cartId, product.id, quantity, cp]
  );

  React.useEffect(() => {
    if (cp && product.id && debouncedInputQuantity > 0) {
      const newQuantity = Math.max(
        1,
        Math.min(cp.stock, debouncedInputQuantity)
      );
      qtyMutation.mutate({
        cartId,
        sizeId: size.id,
        productId: product.id,
        qty: newQuantity,
      });
    }
  }, [debouncedInputQuantity]);

  const onChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setInputQuantity(Number(numericValue));
  };

  const changeQuantity = (change: number) => {
    if (product.id && (change > 0 ? quantity < stock : quantity > 1)) {
      setQuantityChange(quantityChange + change);
      debouncedQtyMutation();
    }
  };

  const deleteCart = () => {
    deleteMutation.mutate(id);
  };

  React.useEffect(() => {
    if (deleteMutation.isSuccess) {
      toast(
        (t) => (
          <span className="bg-black text-background">
            1 item has been deleted
            <button
              onClick={() => {
                toast.dismiss(t.id);
                cancelDeleteMutation.mutate(id);
              }}
              className="ml-2 bg-slate-900 px-2 py-1 rounded-md"
            >
              cancel
            </button>
          </span>
        ),
        {
          style: {
            padding: 1,
            background: "#000",
          },
          duration: 2000,
        }
      );
    }
  }, [deleteMutation.isSuccess]);

  useOutsideClick(inputRef, () => {
    setInputQuantity(quantity);
  });

  return (
    <>
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Checkbox
              checked={selected}
              onCheckedChange={(value) => {
                toggleSelectedCart.mutate({ value: !!value });
              }}
            />
            <div>
              <h3 className="font-bold">Toten Offical</h3>
            </div>
          </div>
          <Button onClick={deleteCart} variant="ghost">
            <X className="text-foreground cursor-pointer " />
          </Button>
        </div>
        <div className="grid lg:grid-cols-2 gap-2">
          <div className="flex items-start pl-6 gap-4">
            <img
              className="w-24 lg:w-32  object-contain"
              src={`${baseURL}/images/${product.primaryImage}`}
              alt={product.name}
            />
            <div>
              <Link
                to={`/product/${product.slug}`}
                className="text-sm lg:text-lg font-bold "
              >
                {product.name}
              </Link>
              <p className="text-muted-foreground">
                {t("cartPage.size")} : {size.label}
              </p>
              <p className="font-bold">
                {formatToIDR(product.price.toString())}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 self-end">
            <div className="flex gap-2  items-center">
              <Button
                disabled={quantity <= 1}
                onClick={() => changeQuantity(-1)}
                size="sm"
                className="h-8 bg-black dark:border hover:bg-black/80"
              >
                <Minus className="text-primary-foreground w-5 h-5" />
              </Button>
              <div className="border focus-within:ring-2 focus-within:ring-black rounded-lg w-max flex items-center">
                <input
                  ref={inputRef}
                  disabled={quantity > stock}
                  max={stock}
                  className="h-full outline-none w-[50px] bg-background text-end pr-2"
                  value={inputQuantity}
                  onChange={onChangeQuantity}
                />
                <div className="w-full bg-border p-1 rounded-r-lg">
                  <p className="text-muted-foreground">{stock}</p>
                </div>
              </div>
              <Button
                disabled={quantity >= stock}
                onClick={() => changeQuantity(+1)}
                variant="ghost"
                size="sm"
                className="h-8 bg-black dark:border hover:bg-black/80"
              >
                <Plus className="text-primary-foreground w-5 h-5" />
              </Button>
            </div>
            <span className="text-sm lg:text-base font-bold uppercase">
              {t("cartPage.subTotal")}: {formatToIDR(product.price * quantity)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
