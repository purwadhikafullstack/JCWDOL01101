import { useProduct, useProductByCategory } from "@/hooks/useProduct";
import React from "react";
import { Link, useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import ProductCard from "../components/ProductCard";
import ReviewStar from "../components/product-detail/ReviewStar";
import ProductDescription from "../components/product-detail/ProductDescription";

const ProductDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: product } = useProduct(slug || "");
  const { data: productsCategory, isLoading } = useProductByCategory(
    product?.id,
    product?.categoryId,
    8
  );
  return (
    <div>
      <div className="w-full flex justify-between">
        <div className="flex-1 pt-4">
          <section className="max-w-[655px]">
            <ProductCarousel images={product?.productImage || []} />
            <section>
              <div className="flex items-center gap-2">
                <span className="leading-3 text-xl font-semibold mr-4">
                  REVIEW
                </span>
                <ReviewStar rating={4} />
                <span className="underline">(184)</span>
              </div>
              <Separator className="my-4" />
            </section>
          </section>
        </div>
        <div className="w-[522px] relative">
          {product && <ProductDescription product={product} />}
        </div>
      </div>
      <div>
        <div className="mt-8 ">
          <span className="flex items-center justify-between uppercase">
            <p className="font-bold text-xl my-4">
              {t("productDetailPage.misc.title")}
            </p>
            {productsCategory && productsCategory.length > 0 && (
              <Link
                className="text-primary font-bold text-sm"
                to={`/products?category=${product?.categoryId}`}
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
      </div>
    </div>
  );
};

export default ProductDetail;
