import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative flex items-center justify-center w-10 h-10 bg-primary rounded-xl transition-transform group-hover:scale-105">
        <Zap className="w-6 h-6 text-primary-foreground fill-current" />
      </div>
      <span className="text-xl font-bold text-foreground tracking-tight">
        Volt<span className="text-primary">Cart</span>
      </span>
    </Link>
  );
};

export default Logo;
