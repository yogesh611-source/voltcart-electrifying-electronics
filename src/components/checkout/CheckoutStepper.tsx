import { cn } from "@/lib/utils";
import { CheckoutStep } from "@/hooks/useCheckout";
import { Check, MapPin, CreditCard, Package } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

const steps = [
  { id: "address" as const, label: "Address", icon: MapPin },
  { id: "payment" as const, label: "Payment", icon: CreditCard },
  { id: "confirmation" as const, label: "Confirmation", icon: Package },
];

const CheckoutStepper = ({ currentStep }: CheckoutStepperProps) => {
  const getStepIndex = (step: CheckoutStep) => steps.findIndex((s) => s.id === step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 sm:w-16 h-0.5 mx-2",
                  index < currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;
