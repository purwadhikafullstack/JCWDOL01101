import { Image } from "@/hooks/useProduct";
import { baseURL } from "@/service";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ProductCarousel = ({ images }: { images: Image[] }) => {
  return (
    images.length > 0 && (
      <Carousel interval={4000} showIndicators={false}>
        {images.map(({ image, id }) => (
          <div key={id} className="h-full w-full">
            <img
              src={`${baseURL}/images/${image}`}
              alt={image}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </Carousel>
    )
  );
};

export default ProductCarousel;
