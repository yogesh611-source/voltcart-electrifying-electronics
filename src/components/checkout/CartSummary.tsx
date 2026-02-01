import { CartItem } from "@/types/product";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartSummary = ({ items, subtotal, shipping, tax, total }: CartSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="border rounded-lg p-4 lg:p-6 bg-muted/20 sticky top-24">
      <h3 className="font-semibold text-lg mb-4">Your Order ({items.length} items)</h3>
      
      <ScrollArea className="max-h-64 lg:max-h-80">
        <div className="space-y-3 pr-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                {item.selectedColor && (
                  <p className="text-xs text-muted-foreground">Color: {item.selectedColor.name}</p>
                )}
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                  <span className="text-sm font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t mt-4 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? "text-green-600" : ""}>
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">GST (18%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {subtotal < 999 && (
        <p className="text-xs text-muted-foreground mt-3">
          Add ₹{Math.ceil(999 - subtotal)} more for free shipping
        </p>
      )}
    </div>
  );
};

export default CartSummary;
