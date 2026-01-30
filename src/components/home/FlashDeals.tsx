import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { flashDeals } from "@/data/mockProducts";

const FlashDeals = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  if (flashDeals.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-volt-orange/10 to-primary/10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Badge className="bg-volt-orange text-white px-4 py-2 text-sm">
              <Clock className="h-4 w-4 mr-2" />
              Flash Deals
            </Badge>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Today's Best Deals</h2>
              <p className="text-muted-foreground">
                Limited time offers - Grab them before they're gone!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Ends in:</span>
            <div className="flex items-center gap-1">
              {[
                { value: timeLeft.hours, label: "h" },
                { value: timeLeft.minutes, label: "m" },
                { value: timeLeft.seconds, label: "s" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-foreground text-background px-3 py-2 rounded-lg min-w-[48px] text-center">
                    <span className="font-mono font-bold text-lg">
                      {formatTime(item.value)}
                    </span>
                  </div>
                  <span className="text-muted-foreground ml-1 mr-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {flashDeals.slice(0, 4).map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button className="gap-2" asChild>
            <Link to="/deals">
              View All Deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
