"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: "Features", href: "#features" },
  ];

  const handleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 md:p-6 backdrop-blur-sm bg-card/80 border-b border-border">
      {/* Logo */}
      <div className="text-2xl md:text-3xl font-bold">
        <span className="text-primary">Link</span>
        <span className="text-muted-foreground">up</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between gap-6 items-center">
        {navItems.map((item) => (
          <motion.a
            key={item.label}
            href={item.href}
            className="text-muted-foreground hover:text-foreground transition-colors relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {item.label}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300"
              layoutId="underline"
            />
          </motion.a>
        ))}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            className="relative px-6 py-2 text-primary-foreground font-semibold rounded-lg 
              border-2 border-primary/40
              bg-gradient-to-r from-primary/90 to-primary
              hover:from-primary hover:to-primary/90
              shadow-[0_0_20px_rgba(var(--primary),0.3)]
              hover:shadow-[0_0_40px_rgba(var(--primary),0.5)]
              transition-all duration-300
              overflow-hidden group"
            onClick={handleLogin}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative z-10">
              Login
            </div>
          </Button>
        </motion.div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                className="relative px-6 py-2 text-primary-foreground font-semibold rounded-lg 
                  border-2 border-primary/40
                  bg-gradient-to-r from-primary/90 to-primary
                  hover:from-primary hover:to-primary/90
                  shadow-[0_0_20px_rgba(var(--primary),0.3)]
                  hover:shadow-[0_0_40px_rgba(var(--primary),0.5)]
                  transition-all duration-300
                  overflow-hidden group"
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative z-10">
                  Login
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
