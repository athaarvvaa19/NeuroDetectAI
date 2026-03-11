import { Link, useLocation } from "react-router-dom";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

export const Navigation = () => {
  const location = useLocation();
  
  const links = [
    { name: "Home", path: "/" },
    { name: "Detect", path: "/detect" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Brain className="w-8 h-8 text-primary group-hover:animate-pulse-glow" />
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            NeuroDetect AI
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors relative ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};
