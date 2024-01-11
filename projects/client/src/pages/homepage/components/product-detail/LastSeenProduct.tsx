import * as React from "react";
import ProductCard from "../ProductCard";
import { useGetLastSeenProduct } from "@/hooks/useLastSeenProduct";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import NewestProductSekeleton from "@/components/skeleton/NewestProductSekeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type RecommendedProductProps = {
  userId: number;
  productId: number;
};

const LastSeenProduct = ({ userId, productId }: RecommendedProductProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [api, setApi] = React.useState<CarouselApi>();
  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(false);
  const { data, isLoading } = useGetLastSeenProduct(userId, productId);

  const scrollPrev = React.useCallback(() => api && api.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api && api.scrollNext(), [api]);

  const onSelect = React.useCallback((api: CarouselApi) => {
    setNextBtnDisabled(!api.canScrollNext());
    setPrevBtnDisabled(!api.canScrollPrev());
  }, []);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
  }, [api, onSelect]);

  return (
    <div>
      <span className="flex items-center justify-between uppercase">
        <p className="font-bold text-sm lg:text-xl my-4">Last seen product</p>
      </span>
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <NewestProductSekeleton product={isDesktop ? 4 : 2} />
        </div>
      ) : (
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
          }}
          className="relative"
        >
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollPrev();
            }}
            className={cn(
              "absolute top-1/3 -translate-y-1/3 left-0 z-10 hidden lg:block",
              prevBtnDisabled && "opacity-50"
            )}
          >
            <ChevronLeft />
          </Button>
          <CarouselContent>
            {data &&
              data.length > 0 &&
              data.map((lastSeen) => (
                <CarouselItem
                  className="basis-1/2 lg:basis-1/4"
                  key={lastSeen.id}
                >
                  <ProductCard product={lastSeen.lastSeenProduct} />
                </CarouselItem>
              ))}
          </CarouselContent>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              scrollNext();
            }}
            className={cn(
              "absolute top-1/3 -translate-y-1/3 right-0 z-10 hidden lg:block",
              nextBtnDisabled && "opacity-50"
            )}
          >
            <ChevronRight />
          </Button>
        </Carousel>
      )}
    </div>
  );
};

export default LastSeenProduct;
