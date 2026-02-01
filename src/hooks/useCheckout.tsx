import { useState, createContext, useContext, ReactNode } from "react";
import { CartItem } from "@/types/product";

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type CheckoutStep = "address" | "payment" | "confirmation";

interface CheckoutContextType {
  step: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  cartItems: CartItem[];
  orderId: string | null;
  orderNumber: string | null;
  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setCartItems: (items: CartItem[]) => void;
  setOrderDetails: (orderId: string, orderNumber: string) => void;
  resetCheckout: () => void;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState<CheckoutStep>("address");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const setOrderDetails = (id: string, number: string) => {
    setOrderId(id);
    setOrderNumber(number);
  };

  const resetCheckout = () => {
    setStep("address");
    setShippingAddress(null);
    setCartItems([]);
    setOrderId(null);
    setOrderNumber(null);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    return subtotal > 999 ? 0 : 99;
  };

  const getTax = () => {
    const subtotal = getSubtotal();
    return Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
  };

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax();
  };

  return (
    <CheckoutContext.Provider
      value={{
        step,
        shippingAddress,
        cartItems,
        orderId,
        orderNumber,
        setStep,
        setShippingAddress,
        setCartItems,
        setOrderDetails,
        resetCheckout,
        getSubtotal,
        getShipping,
        getTax,
        getTotal,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
