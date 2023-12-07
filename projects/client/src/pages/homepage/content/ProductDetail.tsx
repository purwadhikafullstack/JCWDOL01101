import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProduct, useProductByCategory } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { ChevronRight, Star, Verified } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import Review from "../components/Review";
import ProductCartOptions from "../components/ProductCartOptions";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";

const ProductDetail = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { data: product } = useProduct(slug || "");
  const stock = product?.inventory
    ? product.inventory.reduce((prev, curr) => prev + curr.stock, 0)
    : 0;
  const sold = product?.inventory
    ? product.inventory.reduce((prev, curr) => prev + curr.sold, 0)
    : 0;

  const { data: productsCategory, isLoading } = useProductByCategory(
    product?.id,
    product?.categoryId
  );
  return (
    <div>
      <span className="flex gap-1 text-xs group items-center mb-4 cursor-pointer">
        <Link to="/" className="text-primary">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <Link to="/products" className="text-primary">
          Product
        </Link>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <Link
          to={`/products?category=${product?.categoryId}`}
          className="text-primary"
        >
          {product?.productCategory.name}
        </Link>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <p className="overflow-hidden text-ellipsis whitespace-nowrap  w-[200px] group-hover:w-max">
          {product?.name}
        </p>
      </span>
      <div className="product-detail">
        <div className="w-full  product-media">
          <div className="sticky top-[100px]">
            <ProductCarousel images={product?.productImage || []} />
          </div>
        </div>
        <ProductCartOptions
          price={product?.price || 0}
          productId={product?.id!}
          totalStock={stock}
        />
        <div className="w-full product-content">
          <p className="font-bold">{product?.name}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              {t("productDetailPage.product.sold")}{" "}
              <span className="text-muted-foreground">{sold}+</span>
            </span>
            <span className="flex items-center gap-2 leading-3">
              <Star className="w-4 h-4" />5
              <span className="text-muted-foreground ml-2 text-sm">
                (27 {t("productDetailPage.product.rating")})
              </span>
            </span>
            <span className="flex items-center">
              {t("productDetailPage.product.discution")}
              <span className="text-muted-foreground text-sm ml-2">(2)</span>
            </span>
          </div>
          <p className="font-bold text-2xl">
            {formatToIDR(product?.price.toString() || "")}
          </p>
        </div>
        <div className="w-full product-details">
          <div className="border-y mt-4 mb-2 py-2">
            <span className="font-bold text-primary text-sm">
              {t("productDetailPage.product.desc")}
            </span>
          </div>
          <p>{product?.description}</p>
        </div>
        <div className="w-full  shop-credibility">
          <div className="flex gap-2 items-center my-4 border-y  py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage className="object-cover" src="/t10logo.png" />
              <AvatarFallback>T10</AvatarFallback>
            </Avatar>
            <div>
              <span className="flex items-center gap-1">
                <Verified className="w-4 h-4 text-primary" />
                <p className="font-bold">Toten Official</p>
              </span>
              <span className="text-sm flex gap-2 items-center">
                <Star className="w-4 h-4 text-muted-foreground" />
                <p>4.8</p>
                <p className="text-muted-foreground">
                  {t("productDetailPage.product.average")}
                </p>
              </span>
            </div>
          </div>
        </div>
        <Review />
        <div className="other-product">
          <div className="mt-8 ">
            <span className="flex items-center justify-between">
              <p className="font-bold text-lg my-2">
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
            <div className="grid grid-cols-6 gap-4">
              {isLoading ? (
                <NewestProductSekeleton product={12} />
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
    </div>
  );
};

export default ProductDetail;
