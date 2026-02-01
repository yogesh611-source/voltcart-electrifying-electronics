import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import CartSummary from "@/components/checkout/CartSummary";
import { CheckoutProvider, useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutContent = () => {
  const navigate = useNavigate();
  const { step, cartItems, setCartItems, getSubtotal, getShipping, getTax, getTotal } = useCheckout();
  const { items } = useCart();
  const { user, loading } = useAuth();

  // Initialize cart items from cart context
  useEffect(() => {
    if (items.length > 0 && cartItems.length === 0) {
      setCartItems(items);
    }
  }, [items, cartItems.length, setCartItems]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/checkout");
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty cart message
  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-12">
        <div className="p-6 rounded-full bg-muted mb-4">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to continue checkout</p>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case "address":
        return <AddressForm />;
      case "payment":
        return <PaymentSection />;
      case "confirmation":
        return <OrderConfirmation />;
      default:
        return <AddressForm />;
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <CheckoutStepper currentStep={step} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-background border rounded-lg p-6">
            {renderStep()}
          </div>
        </div>
        
        {step !== "confirmation" && (
          <div className="lg:col-span-1">
            <CartSummary
              items={cartItems.length > 0 ? cartItems : items}
              subtotal={getSubtotal()}
              shipping={getShipping()}
              tax={getTax()}
              total={getTotal()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { getCartCount } = useCart();

  return (
    <CheckoutProvider>
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={getCartCount()} />
        <main className="flex-1">
          <CheckoutContent />
        </main>
        <Footer />
      </div>
    </CheckoutProvider>
  );
};

export default CheckoutPage;
