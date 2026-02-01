import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Loader2, Shield } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentSection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { shippingAddress, cartItems, setStep, setOrderDetails, getSubtotal, getShipping, getTax, getTotal } = useCheckout();
  const { session } = useAuth();
  const { clearCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!shippingAddress || cartItems.length === 0 || !session) {
      toast({
        title: "Error",
        description: "Please complete all checkout steps.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      // Create order via edge function
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          quantity: item.quantity,
          unitPrice: item.product.price,
          selectedColor: item.selectedColor?.name,
          selectedVariant: item.selectedVariant?.name,
        })),
        shippingAddress,
        subtotal: getSubtotal(),
        shipping: getShipping(),
        tax: getTax(),
        total: getTotal(),
      };

      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: orderPayload,
      });

      if (error) {
        throw new Error(error.message || "Failed to create order");
      }

      const { orderId, orderNumber, razorpayOrderId, razorpayKeyId, amount, currency } = data;

      // Open Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: currency,
        name: "VoltCart",
        description: `Order #${orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              }
            );

            if (verifyError) {
              throw new Error(verifyError.message || "Payment verification failed");
            }

            // Payment successful
            setOrderDetails(orderId, orderNumber);
            clearCart();
            setStep("confirmation");
            
            toast({
              title: "Payment Successful!",
              description: `Order #${orderNumber} has been placed.`,
            });
          } catch (err: any) {
            toast({
              title: "Payment Verification Failed",
              description: err.message || "Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: shippingAddress.name,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "Your order has been saved. You can complete payment later.",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Payment Failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        
        <div className="border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Razorpay Secure Checkout</p>
              <p className="text-sm text-muted-foreground">
                Credit/Debit Cards, UPI, Netbanking, Wallets
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={getShipping() === 0 ? "text-green-600" : ""}>
                {getShipping() === 0 ? "Free" : formatPrice(getShipping())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (18%)</span>
              <span>{formatPrice(getTax())}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address Summary */}
        {shippingAddress && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-medium">Shipping To</h4>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{shippingAddress.name}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
              <p>Phone: {shippingAddress.phone}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Shield className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep("address")}
          disabled={isProcessing}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handlePayment} 
          disabled={isProcessing} 
          className="flex-1 gap-2" 
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay {formatPrice(getTotal())}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentSection;
