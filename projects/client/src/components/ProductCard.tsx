import { CheckSquare, Star } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

type Product = {
  name: string;
  price: number;
  imageUrl: string;
  sell: number;
  stock: number;
  place: string;
  rating: number;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.name}`}>
      <div className="rounded-md p-2 shadow-sm border">
        <img src={product.imageUrl} alt={product.name} />
        <div className="flex flex-col gap-2 text-sm">
          <p className="whitespace-nowrap overflow-hidden m-0 text-ellipsis p-0 ">
            {product.name}
          </p>
          <span>
            <p className="font-bold">{product.price}</p>
          </span>
          <span className="text-muted-foreground flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            <p>{product.place}</p>
          </span>
          <span className="text-muted-foreground lg:flex items-center gap-2 hidden">
            <Star className="w-4 h-4 text-transparent" fill="#003d29" />
            <p className="text-xs">
              {product.rating} | {product.sell} terjual
            </p>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
