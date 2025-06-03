import * as React from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image as ImageType } from "@prisma/client";

interface CarouselProps {
  productImages: ImageType[];
}

const CarouselComponent: React.FC<CarouselProps> = ({ productImages }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className=" w-full overflow-hidden md:overflow-visible"
    >
      <CarouselContent>
        {Array.from({
          length: productImages.length,
        }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <Image
              priority
              src={productImages[index].url}
              alt="product-image"
              width={500}
              height={500}
              className="rounded-md object-cover border border-gray-200 w-full"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselComponent;
