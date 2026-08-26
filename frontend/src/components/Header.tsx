"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, ChevronDown, Globe, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";

import { useConsultation } from "./consultation-provider";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Modular Kitchens", href: "/modular-kitchens" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Testimonials", href: "/testimonials" },
];

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'Hindi', short: 'HI' },
  { code: 'bn', label: 'Bengali', short: 'BN' },
  { code: 'te', label: 'Telugu', short: 'TE' },
  { code: 'mr', label: 'Marathi', short: 'MR' },
  { code: 'ta', label: 'Tamil', short: 'TA' },
  { code: 'gu', label: 'Gujarati', short: 'GU' },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  // mounted ref avoids the 'state from mount effect' anti-pattern
  const mountedRef = useRef(false);
  const [, forceUpdate] = useState(0);
  const mounted = mountedRef.current;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { openModal } = useConsultation();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    setLangMenuOpen(false);
    
    // Set Google Translate cookie
    if (lang === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/`;
      document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;
    }

    const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleSelect) {
      googleSelect.value = lang;
      // Google Translate requires the change event to bubble
      googleSelect.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    } else {
      // If the widget hasn't loaded properly, reload the page to apply the cookie
      window.location.reload();
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    forceUpdate(1);
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (headerRef.current) {
        headerRef.current.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Google Translate Init
    if (typeof window !== "undefined") {
      const gwindow = window as any;
      gwindow.googleTranslateElementInit = () => {
        if (gwindow.google && gwindow.google.translate) {
          const container = document.getElementById("google_translate_element");
          if (container && container.childElementCount === 0) {
            new gwindow.google.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages: "en,hi,bn,te,mr,ta,gu",
              },
              "google_translate_element"
            );
          }
        }
      };

      if (!document.getElementById("google-translate-script")) {
        const addScript = document.createElement("script");
        addScript.id = "google-translate-script";
        addScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        addScript.async = true;
        document.body.appendChild(addScript);
      } else if (gwindow.google && gwindow.google.translate) {
        gwindow.googleTranslateElementInit();
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
      <m.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`pointer-events-auto w-full max-w-[1400px] flex items-center justify-between gap-4 rounded-full transition-[background-color,border-color,box-shadow] duration-500 whitespace-nowrap bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg border border-white/40 dark:border-white/10 h-16 px-6 md:px-8`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 lg:gap-4 group shrink-0">
          <div className="relative rounded-full overflow-hidden bg-white dark:bg-slate-800 shadow-md flex items-center justify-center group-hover:shadow-lg transition duration-300 group-hover:scale-105 border border-black/5 dark:border-white/5 z-10 w-12 h-12 font-heading font-bold text-xl md:text-2xl text-navy dark:text-slate-100">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl text-navy dark:text-slate-100 tracking-tight group-hover:text-saffron transition-colors leading-none">
              AVYRON<span className="text-saffron">.</span>
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-navy/60 dark:text-slate-400 tracking-wider uppercase mt-0.5 md:mt-1 group-hover:text-saffron/80 transition-colors">
              Luxury Interiors
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className="relative group whitespace-nowrap">
                <Link 
                  href={item.href} 
                  className={`relative z-10 flex items-center justify-center px-4 py-1.5 md:py-2 md:px-5 rounded-full transition-all duration-300 border ${isActive ? 'border-saffron/70 text-saffron bg-black/5 dark:bg-black/20' : 'border-transparent text-navy/70 dark:text-slate-400 hover:text-navy dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  <span className="text-sm font-semibold tracking-wide">
                    {item.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-navy dark:text-slate-300 rounded-full relative w-10 h-10"
              type="button"
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 opacity-100 transition dark:-rotate-90 dark:scale-95 dark:opacity-0 text-navy" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-95 opacity-0 transition dark:rotate-0 dark:scale-100 dark:opacity-100 text-slate-100" />
            </button>
          )}

          {/* Custom Language Selector */}
          <div className="relative flex items-center" ref={langDropdownRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-full transition duration-300 outline-none group border bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border-transparent hover:border-black/10 dark:hover:border-white/10"
              aria-label="Select Language"
            >
              <Globe className="w-4 h-4 text-navy/70 dark:text-slate-400 group-hover:text-navy dark:group-hover:text-slate-200 transition-colors shrink-0" />
              <span className="notranslate text-xs sm:text-sm font-semibold text-navy/80 dark:text-slate-300 group-hover:text-navy dark:group-hover:text-slate-100 uppercase mt-[1px]">
                {languages.find(l => l.code === currentLang)?.short || 'EN'}
              </span>
              <ChevronDown className={`w-3 h-3 text-navy/50 dark:text-slate-500 transition-transform duration-300 shrink-0 ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {langMenuOpen && (
                <m.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-xl rounded-2xl py-2 w-44 z-50 flex flex-col overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`notranslate text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                        currentLang === lang.code 
                          ? 'text-saffron bg-saffron/10' 
                          : 'text-navy/80 dark:text-slate-300 hover:text-navy dark:hover:text-slate-100'
                      }`}
                    >
                      {lang.short} - {lang.label}
                    </button>
                  ))}
                </m.div>
              )}
            </AnimatePresence>
            
            {/* Hidden Google Translate Element */}
            <div id="google_translate_element" className="hidden"></div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={openModal}
            className="hidden sm:inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 py-2 rounded-full bg-navy text-white hover:bg-saffron hover:text-white transition-colors duration-300 shadow-md hover:shadow-lg shadow-navy/20 hover:shadow-saffron/20 px-4 h-9 text-xs sm:px-5 sm:h-10 sm:text-sm"
          >
            Get Free Consultation
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-navy/5 dark:bg-white/5 text-navy dark:text-slate-300 hover:bg-navy/10 dark:hover:bg-white/10 transition-colors" 
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <m.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[calc(100%+1rem)] left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl rounded-3xl py-6 px-4 flex flex-col gap-2 lg:hidden overflow-hidden pointer-events-auto origin-top"
            >
              <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto px-2">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium transition-colors px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl w-full ${isActive ? 'text-saffron bg-black/5 dark:bg-white/5' : 'text-navy/80 dark:text-slate-300 hover:text-saffron dark:hover:text-saffron'}`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className="flex flex-col gap-4 px-6 mt-2 pt-4 border-t border-black/10 dark:border-white/10">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal();
                  }}
                  className="w-full py-3 rounded-full bg-navy text-white hover:bg-saffron transition-colors shadow-md text-sm font-semibold"
                >
                  Get Free Consultation
                </button>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-navy/80 dark:text-slate-300">
                    <span className="text-sm font-semibold">Translation</span>
                  </div>
                  {mounted && (
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      aria-label="Toggle theme"
                      className="p-2 rounded-full bg-navy/5 dark:bg-white/5 text-navy dark:text-slate-300 hover:bg-navy/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.header>
      <style dangerouslySetInnerHTML={{__html: `
        .goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
        }
        .VIpgJd-ZVi9od-ORHb-OEVmcd {
          display: none !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        #goog-gt-tt, .goog-te-balloon-frame {
          display: none !important;
        }
      `}} />
    </div>
  );
}

