"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initial animation
    setTimeout(() => setIsVisible(true), 100);

    if (!transparent) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const isScrolled = transparent ? scrollY > 100 : true;

  const navLinks = [
    { href: "/search?listingType=rent", label: "เช่า" },
    { href: "/search?listingType=sale", label: "ขาย" },
    { href: "/#promotions", label: "โปรโมชัน" },
    { href: "/other-services", label: "บริการอื่นๆ" },
    { href: "/#reviews", label: "รีวิว" },
    { href: "/#contact", label: "ติดต่อ" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-white/98 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/20"
            : "bg-gradient-to-b from-black/30 to-transparent"
        } ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        {/* Gold accent line at top */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c6af6c] to-transparent transition-opacity duration-500 ${isScrolled ? "opacity-100" : "opacity-0"}`} />

        <div className={`container mx-auto px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`relative transition-all duration-500 ${isScrolled ? "w-12 h-12" : "w-14 h-14"}`}>
              <Image
                src="/web-logo.png"
                alt="Pariwat Property"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold tracking-wide transition-all duration-500 ${
                  isScrolled
                    ? "text-lg text-[#a38444]"
                    : "text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                }`}
              >
                Pariwat Property
              </span>
              <span className={`text-[8px] tracking-[0.2em] uppercase transition-all duration-500 ${
                isScrolled ? "text-gray-500" : "text-white/80"
              }`}>
                Premium Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 font-medium text-sm tracking-wide transition-all duration-300 group ${
                  isScrolled
                    ? "text-gray-700 hover:text-[#c6af6c]"
                    : "text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
                {/* Hover underline effect */}
                <span className={`absolute bottom-0 left-1/2 w-0 h-[2px] bg-[#c6af6c] transition-all duration-300 group-hover:w-3/4 group-hover:left-[12.5%] ${
                  isScrolled ? "bg-[#c6af6c]" : "bg-white"
                }`} />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${
              isScrolled
                ? "hover:bg-[#c6af6c]/10 text-gray-700"
                : "hover:bg-white/10 text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute left-0 block h-0.5 w-6 transform transition-all duration-300 ${
                isScrolled ? "bg-gray-700" : "bg-white"
              } ${mobileMenuOpen ? "top-3 rotate-45" : "top-1"}`} />
              <span className={`absolute left-0 top-3 block h-0.5 w-6 transition-all duration-300 ${
                isScrolled ? "bg-gray-700" : "bg-white"
              } ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 block h-0.5 w-6 transform transition-all duration-300 ${
                isScrolled ? "bg-gray-700" : "bg-white"
              } ${mobileMenuOpen ? "top-3 -rotate-45" : "top-5"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-60 md:hidden transition-all duration-500 ${
        mobileMenuOpen ? "visible" : "invisible"
      }`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-500 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <div className="pt-16 px-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Image
                src="/web-logo.png"
                alt="Pariwat Property"
                width={48}
                height={48}
                className="object-contain"
                unoptimized
              />
              <div>
                <div className="font-bold text-[#a38444]">Pariwat Property</div>
                <div className="text-[10px] tracking-[0.15em] uppercase text-gray-500">Premium Real Estate</div>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="px-4 py-6 space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 text-gray-700 hover:bg-[#c6af6c]/10 hover:text-[#c6af6c] rounded-xl transition-all duration-300 font-medium ${
                  mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${index * 50 + 100}ms` : "0ms" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c6af6c] via-[#d4c18a] to-[#c6af6c]" />
        </div>
      </div>
    </>
  );
}
