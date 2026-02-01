import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/category/:category" element={<ProductsPage />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/deals" element={<ProductsPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
