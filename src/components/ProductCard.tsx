import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors?.[0]);
  };

  return (
    <div
      className={cn(
        "group relative bg-card rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-volt-lg hover:-translate-y-1",
        className
      )}
    >
      {/* Discount Badge */}
      {product.discount && (
        <Badge className="absolute top-3 left-3 z-10 bg-volt-orange text-white">
          {product.discount}% OFF
        </Badge>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={cn(
          "absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200",
          inWishlist
            ? "bg-destructive text-white"
            : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:bg-background hover:text-destructive"
        )}
      >
        <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Quick Actions */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 gap-1 bg-background/95 backdrop-blur-sm"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background/95 backdrop-blur-sm"
              asChild
            >
              <Link to={`/product/${product.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating)
                    ? "text-volt-warning fill-volt-warning"
                    : "text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-volt-orange mt-2">
            Only {product.stock} left in stock
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-destructive mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
