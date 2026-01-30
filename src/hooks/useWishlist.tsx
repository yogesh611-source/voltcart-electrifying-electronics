import { useState, createContext, useContext, ReactNode } from "react";
import { WishlistItem, Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const addToWishlist = (product: Product) => {
    const exists = items.some((item) => item.product.id === product.id);
    if (exists) {
      toast({
        title: "Already in wishlist",
        description: `${product.name} is already in your wishlist.`,
      });
      return;
    }

    setItems((prev) => [
      ...prev,
      { product, addedAt: new Date().toISOString() },
    ]);

    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const getWishlistCount = () => {
    return items.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
