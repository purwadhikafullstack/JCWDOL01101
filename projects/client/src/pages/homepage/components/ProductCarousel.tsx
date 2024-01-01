import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Image } from "@/hooks/useProduct";
import { baseURL } from "@/service";
import React, { useCallback } from "react";
import CarouselThumb from "./CarouselThumb";
import useEmblaCarousel from "embla-carousel-react";

const ProductCarousel = ({ images }: { images: Image[] }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [emblaThumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const imageByIndex = (index: number) => images[index % images.length];

  const onThumbClick = React.useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  const onSelect = useCallback(() => {
    if (!api || !thumbApi) return;
    setSelectedIndex(api.selectedScrollSnap());
    thumbApi.scrollTo(api.selectedScrollSnap());
  }, [api, thumbApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
  }, [api, onSelect]);

  return (
    images.length > 0 && (
      <>
        <Carousel setApi={setApi}>
          <CarouselContent>
            {images.map(({ image, id }) => (
              <CarouselItem key={id}>
                <img
                  src={`${baseURL}/images/${image}`}
                  alt={image}
                  className="object-contain w-full h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="overflow-hidden" ref={emblaThumbRef}>
          <div className="flex gap-2 my-4">
            {images.map((_, index) => (
              <CarouselThumb
                key={index}
                selected={index === selectedIndex}
                imgSrc={`${baseURL}/images/${imageByIndex(index).image}`}
                index={index}
                onClick={() => onThumbClick(index)}
              />
            ))}
          </div>
        </div>
      </>
    )
  );
};

export default ProductCarousel;
