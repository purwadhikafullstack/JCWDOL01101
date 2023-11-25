import { baseURL } from "@/service";
import React from "react";
import { Carousel } from "react-responsive-carousel";

const ProductCarousel = ({ image }: { image: string | string[] }) => {
  return (
    <Carousel
      interval={4000}
      transitionTime={800}
      showIndicators={false}
      showArrows={false}
      showStatus={false}
    >
      <div className="overflow-hidden group">
        <img
          src={`${baseURL}/${image}`}
          alt="carousel 1"
          className="rounded-lg"
        />
      </div>
      <div>
        <img
          src={`${baseURL}/${image}`}
          alt="carousel 1"
          className="rounded-lg"
        />
      </div>
      <div>
        <img
          src={`${baseURL}/${image}`}
          alt="carousel 1"
          className="rounded-lg"
        />
      </div>
    </Carousel>
  );
};

export default ProductCarousel;
