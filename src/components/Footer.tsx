import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from "lucide-react";
import Logo from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockProducts";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over ₹999" },
    { icon: Shield, title: "Secure Payment", desc: "100% protected" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day returns" },
    { icon: CreditCard, title: "Flexible Payment", desc: "Multiple options" },
  ];

  return (
    <footer className="bg-foreground text-background">
      {/* Features Bar */}
      <div className="border-b border-background/10">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-background/10">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-background/60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-xl">
                <Mail className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">VoltCart</span>
            </div>
            <p className="text-background/70 mb-4 text-sm">
              Your one-stop destination for premium electronics. Quality products, 
              competitive prices, and exceptional service.
            </p>
            <div className="space-y-3">
              <p className="font-medium text-sm">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button className="shrink-0">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link 
                    to={`/category/${category.slug}`}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "FAQs", path: "/faq" },
                { name: "Shipping Info", path: "/shipping" },
                { name: "Returns Policy", path: "/returns" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-background/70 shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">
                  123 Electronics Street, Tech City, India 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-background/70" />
                <span className="text-background/70 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-background/70" />
                <span className="text-background/70 text-sm">support@voltcart.com</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {currentYear} VoltCart. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                alt="PayPal" 
                className="h-6 opacity-70"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                alt="Mastercard" 
                className="h-6 opacity-70"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                alt="Visa" 
                className="h-6 opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
