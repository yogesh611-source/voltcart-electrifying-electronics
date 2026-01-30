import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate subscription
    setIsSubmitted(true);
    toast({
      title: "Successfully subscribed!",
      description: "You'll receive our latest updates and offers.",
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-primary-foreground/80 mb-8">
            Subscribe to get exclusive deals, new product alerts, and the latest
            tech news delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-primary-foreground"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              className="gap-2 shrink-0"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <Check className="h-4 w-4" />
                  Subscribed
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-primary-foreground/60 mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
