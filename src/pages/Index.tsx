import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FlashDeals from "@/components/home/FlashDeals";
import BrandShowcase from "@/components/home/BrandShowcase";
import Newsletter from "@/components/home/Newsletter";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, updateQuantity, removeFromCart, getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={getCartCount()}
        wishlistCount={getWishlistCount()}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <FlashDeals />
        <BrandShowcase />
        <Newsletter />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
};

export default Index;
