import { Image } from "@/hooks/useProduct";
import { baseURL } from "@/service";
import React from "react";
import { Carousel } from "react-responsive-carousel";

const ProductCarousel = ({ images }: { images: Image[] }) => {
  return (
    images.length > 0 && (
      <Carousel
        interval={4000}
        showIndicators={false}
        showArrows={false}
        showStatus={false}
      >
        {images.map(({ image, id }) => (
          <div key={id} className="max-h-[300px]">
            <img
              src={`${baseURL}/images/${image}`}
              alt={image}
              className="rounded-lg object-contain w-full h-full"
            />
          </div>
        ))}
      </Carousel>
    )
  );
};

export default ProductCarousel;
