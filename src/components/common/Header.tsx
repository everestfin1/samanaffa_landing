"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "./Button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: "#pourquoi", label: "Pourquoi Sama Naffa" },
    { href: "#faq", label: "FAQ" },
    { href: "#assistance", label: "Assistance" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
              <span className="text-background font-bold text-sm">SN</span>
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">Sama Naffa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Button href="/personas" size="sm">
              Ouvrir mon Naffa
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-6">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <Button
                  href="/personas"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ouvrir mon Naffa
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
