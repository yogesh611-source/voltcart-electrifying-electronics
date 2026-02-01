import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

const OrderConfirmation = () => {
  const { orderNumber, shippingAddress, resetCheckout } = useCheckout();

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Order Confirmed!</h2>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-left max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-semibold text-lg">{orderNumber}</p>
          </div>
        </div>

        {shippingAddress && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Shipping To:</p>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{shippingAddress.name}</p>
              <p>{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your registered email address.
            You can track your order status in your account dashboard.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" asChild onClick={resetCheckout}>
          <Link to="/orders" className="gap-2">
            <Package className="h-4 w-4" />
            View My Orders
          </Link>
        </Button>
        <Button asChild onClick={resetCheckout}>
          <Link to="/products" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
