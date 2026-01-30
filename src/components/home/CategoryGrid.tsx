import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Laptop, 
  Gamepad2, 
  Headphones, 
  Home, 
  Cable,
  ArrowRight
} from "lucide-react";
import { categories } from "@/data/mockProducts";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Home,
  Cable,
};

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
          <p className="text-muted-foreground">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Smartphone;
            return (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className={cn(
                  "group relative p-6 rounded-2xl bg-card border text-center transition-all duration-300 hover:shadow-volt-lg hover:-translate-y-1 overflow-hidden",
                  "animate-slide-up"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.productCount} products
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
