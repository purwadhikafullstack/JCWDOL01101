import React from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, NextButton, PrevButton } from "./MainCarouselArrow";

const carouselImages = [
  "/carousel/1.jpg",
  "/carousel/2.jpg",
  "/carousel/3.jpg",
];

const MainCarousel = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const scrollPrev = React.useCallback(() => api && api.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api && api.scrollNext(), [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[Autoplay({ delay: 5000 })]}
      opts={{
        loop: true,
        slidesToScroll: 1,
      }}
      className="relative group"
    >
      <PrevButton onClick={scrollPrev} />
      <CarouselContent>
        {carouselImages.map((image, index) => (
          <CarouselItem key={index} className="cursor-pointer">
            <img src={image} alt={`carousel-${index}`} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <NextButton onClick={scrollNext} />
    </Carousel>
  );
};

export default MainCarousel;
