import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    subtitle: "Titanium. So strong. So light.",
    description: "The most powerful iPhone ever with A17 Pro chip.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200",
    cta: "Shop Now",
    link: "/product/iphone-15-pro-max",
    bgColor: "from-slate-900 to-slate-800",
  },
  {
    id: 2,
    title: "Galaxy S24 Ultra",
    subtitle: "Galaxy AI is here",
    description: "Search like never before with AI-powered features.",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200",
    cta: "Explore",
    link: "/product/samsung-galaxy-s24-ultra",
    bgColor: "from-violet-900 to-purple-800",
  },
  {
    id: 3,
    title: "MacBook Pro M3",
    subtitle: "Supercharged by M3",
    description: "The most advanced Mac laptops for demanding workflows.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
    cta: "Learn More",
    link: "/product/macbook-pro-14-m3-pro",
    bgColor: "from-gray-900 to-gray-800",
  },
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-in-out",
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
          )}
        >
          {/* Background Image with Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r",
              slide.bgColor
            )}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-[90%] w-auto object-contain opacity-90 hidden md:block"
            />
          </div>

          {/* Content */}
          <div className="relative container-custom h-full flex items-center">
            <div className="max-w-xl text-white">
              <p className="text-primary-foreground/80 mb-2 animate-fade-in">
                {slide.subtitle}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 animate-slide-up">
                {slide.description}
              </p>
              <Button
                size="lg"
                className="gap-2 bg-white text-foreground hover:bg-white/90"
                asChild
              >
                <Link to={slide.link}>
                  {slide.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
