import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProduct } from "@/hooks/useProduct";
import { formatToIDR } from "@/lib/utils";
import { Car, MapPin, Star, Verified } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";
import ProductCartOptions from "../components/ProductCartOptions";
import Review from "../components/Review";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product } = useProduct(slug || "");

  return (
    <div className="product-detail">
      <div className="w-full  product-media">
        <div className="sticky top-[100px]">
          <ProductCarousel image={product?.image || ""} />
        </div>
      </div>
      <ProductCartOptions
        price={product?.price || 0}
        productId={product?.id!}
        totalStock={product?.stock || 0}
      />
      <div className="w-full product-content">
        <p className="font-bold">{product?.name}</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            Sold <span className="text-muted-foreground">{product?.sold}+</span>
          </span>
          <span className="flex items-center gap-2 leading-3">
            <Star className="w-4 h-4" />5
            <span className="text-muted-foreground ml-2 text-sm">
              (27 rating)
            </span>
          </span>
          <span className="flex items-center">
            Discution{" "}
            <span className="text-muted-foreground text-sm ml-2">(2)</span>
          </span>
        </div>
        <p className="font-bold text-2xl">
          {formatToIDR(product?.price.toString() || "")}
        </p>
      </div>
      <div className="w-full product-details">
        <div className="border-y mt-4 mb-2 py-2">
          <span className="font-bold text-primary text-sm">Description</span>
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
              <p className="text-muted-foreground">rata-rata ulasan</p>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full shipment-variant">
        <div>
          <p className="font-bold">Shipment</p>
          <span className="flex gap-2 items-center">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm">
              Send from <strong>Tokyo</strong>
            </p>
          </span>
          <span className="flex gap-2 items-center">
            <Car className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm">Regular shipping cost 40rb - 70rb</p>
          </span>
          <p className="ml-6 text-sm text-muted-foreground">
            Estimated arrival 18 - 22 Nov
          </p>
        </div>
      </div>
      <Review />
      <div className="other-product">
        <div className="mt-8 ">
          <span className="flex items-center justify-between">
            <p className="font-bold text-lg my-2">
              Other products from this category
            </p>
            <Link className="text-primary font-bold text-sm" to="/category">
              See More
            </Link>
          </span>
          <div className="grid grid-cols-6 gap-4"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
