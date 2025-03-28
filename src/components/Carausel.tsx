import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const images = [
  "https://res.cloudinary.com/dqkzwt6oe/image/upload/v1743191810/odr7bmjvi1l5zl6eie2h.jpg",
  "https://res.cloudinary.com/dqkzwt6oe/image/upload/v1743181923/vabzcwlrcrxx7yyiczqc.jpg",
  "https://res.cloudinary.com/dqkzwt6oe/image/upload/v1743180871/p9qba2f9yazy17gsw9km.jpg",
  "https://res.cloudinary.com/dqkzwt6oe/image/upload/v1743191994/qfft7f1ptvypg9kfqbme.jpg",
  "https://res.cloudinary.com/dqkzwt6oe/image/upload/v1743182050/g8uv6fw2q8vpmouo8sfx.jpg"
];

export function CarouselDemo() {
  return (
    <div className="flex justify-center items-center w-full p-4">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full max-w-4xl shadow-xl rounded-lg overflow-hidden"
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="flex items-center justify-center p-0 aspect-video">
                    <img
                      src={img}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Visible navigation arrows */}
        <CarouselPrevious className="size-12 hover:bg-primary/20" />
        <CarouselNext className="size-12 hover:bg-primary/20" />
      </Carousel>
    </div>
  );
}