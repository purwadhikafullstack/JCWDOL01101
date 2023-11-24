import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MainCarousel = () => {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      interval={4000}
      transitionTime={800}
      showThumbs={false}
      showArrows={false}
      showStatus={false}
    >
      <div>
        <img src="/carousel/1.jpg" alt="carousel 1" className="rounded-lg" />
      </div>
      <div>
        <img src="/carousel/2.jpg" alt="carousel 2" className="rounded-lg" />
      </div>
      <div>
        <img src="/carousel/3.jpg" alt="carousel 3" className="rounded-lg" />
      </div>
    </Carousel>
  );
};

export default MainCarousel;
