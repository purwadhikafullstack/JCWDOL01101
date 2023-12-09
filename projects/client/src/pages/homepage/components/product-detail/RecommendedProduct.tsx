import React from "react";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import { useProductByCategory } from "@/hooks/useProduct";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

type RecommendedProductProps = {
  categoryId: number;
  productId: number;
};

const RecommendedProduct = ({
  categoryId,
  productId,
}: RecommendedProductProps) => {
  const { t } = useTranslation();
  const { data: productsCategory, isLoading } = useProductByCategory(
    productId,
    categoryId,
    8
  );
  return (
    <div className="mt-8 ">
      <span className="flex items-center justify-between uppercase">
        <p className="font-bold text-xl my-4">
          {t("productDetailPage.misc.title")}
        </p>
        {productsCategory && productsCategory.length > 0 && (
          <Link
            className="text-primary font-bold text-sm"
            to={`/products?category=${categoryId}`}
          >
            {t("productDetailPage.misc.sub")}
          </Link>
        )}
      </span>
      <div className="grid grid-cols-4 gap-4">
        {isLoading ? (
          <NewestProductSekeleton product={8} />
        ) : (
          <>
            {productsCategory && productsCategory.length > 0 ? (
              <>
                {productsCategory.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </>
            ) : (
              <div className="col-span-6 text-center">
                <p className="text-sm">
                  {t("productDetailPage.misc.noProduct")}
                </p>
                <Link to="/products" className="underline text-primary">
                  {t("productDetailPage.misc.noProductLink")}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendedProduct;
