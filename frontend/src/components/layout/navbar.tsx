"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "How We Work", href: "#how-we-work" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <div className={`fixed left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4 md:px-8 ${isScrolled ? "top-6" : "top-0"}`}>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-full py-3 px-6 md:px-10"
            : "bg-transparent py-6 px-4 md:px-6"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-heading text-2xl font-bold tracking-widest uppercase relative">
            AVYRON
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-accent transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 pl-4 border-l border-border">
            <ThemeToggle />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6">
              Start Project
            </Button>
          </div>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute top-[calc(100%+1rem)] left-0 w-full bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl py-6 px-6 flex flex-col gap-6 md:hidden overflow-hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-foreground/80 hover:text-accent transition-colors px-4 py-2 hover:bg-muted rounded-xl"
            >
              {link.name}
            </Link>
          ))}
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full mt-2 h-12 text-base">
            Start Project
          </Button>
        </motion.div>
      )}
      </motion.header>
    </div>
  );
}
