"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Globe, CheckCircle2, MessageCircle } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("newsletter-email") as HTMLInputElement).value;
    
    setIsSubmitting(true);
    setError(null);
    try {
      const { formService } = await import('@/services/formService');
      await formService.subscribeNewsletter({ email, source: 'footer' });
      setIsSubscribed(true);
    } catch (err) {
      console.error("Newsletter error:", err);
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="relative bg-slate-50 dark:bg-[#050B14] text-navy dark:text-white pt-12 pb-4 overflow-hidden border-t border-black/10 dark:border-white/10 mt-auto">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-saffron/20 dark:bg-saffron/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/3 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Newsletter Section */}
        <div className="mb-12 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-saffron/20 via-blue-500/10 to-saffron/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-700"></div>
          <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-xl rounded-2xl px-6 py-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-saffron to-transparent opacity-50"></div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-navy to-navy/70 dark:from-white dark:to-white/70">
                Interior Design Insights
              </h3>
              <p className="text-slate-600 dark:text-white/60 mt-1 text-sm md:text-base">
                Join our newsletter for the latest in luxury interior trends, design tips, and bespoke residential projects.
              </p>
            </div>
            {isSubscribed ? (
              <div className="flex w-full md:w-auto relative items-center gap-3 bg-green-500/10 dark:bg-green-500/20 px-6 py-3 rounded-full border border-green-500/20 text-green-700 dark:text-green-400 mt-4 md:mt-0">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium text-sm">Thanks for subscribing!</span>
              </div>
            ) : (
              <form className="flex w-full md:w-auto relative mt-4 md:mt-0 flex-col" onSubmit={handleSubscribe}>
                <div className="relative w-full">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input
                    id="newsletter-email"
                    name="newsletter-email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    disabled={isSubmitting}
                    className="w-full md:w-[320px] bg-white dark:bg-black/20 backdrop-blur-md border border-black/10 dark:border-white/10 text-slate-800 dark:text-white pl-5 pr-[110px] py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron/50 transition placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-inner text-sm disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-saffron hover:bg-saffron/90 text-white px-4 rounded-full font-semibold transition hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md shadow-saffron/20 text-sm disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {isSubmitting ? "Wait..." : "Subscribe"} {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-2 pl-2">{error}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 mb-20">
          <div className="w-full lg:w-[75%] grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            
            {/* Column 1 */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-navy dark:text-white tracking-wider flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-saffron shadow-[0_0_10px_rgba(255,153,51,0.8)]"></span>
                STUDIO
              </h4>
              <ul className="space-y-4">
                {["Our Story", "Philosophy", "Design Team", "Careers", "Contact Us"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="group flex items-center gap-2 text-slate-600 dark:text-white/70 hover:text-navy dark:hover:text-white transition-colors duration-300 w-fit">
                      <span className="h-px w-0 bg-saffron transition-[width] duration-300 group-hover:w-4"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-navy dark:text-white tracking-wider flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                SERVICES
              </h4>
              <ul className="space-y-4">
                {["Residential Design", "Commercial Spaces", "Bespoke Furniture", "Lighting Design", "Consultation", "Styling"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="group flex items-center gap-2 text-slate-600 dark:text-white/70 hover:text-navy dark:hover:text-white transition-colors duration-300 w-fit">
                      <span className="h-px w-0 bg-saffron transition-[width] duration-300 group-hover:w-4"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-navy dark:text-white tracking-wider flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                PORTFOLIO
              </h4>
              <ul className="space-y-4">
                {["Luxury Villas", "Penthouses", "Corporate Offices", "Hospitality", "Retail Boutiques"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="group flex items-center gap-2 text-slate-600 dark:text-white/70 hover:text-navy dark:hover:text-white transition-colors duration-300 w-fit">
                      <span className="h-px w-0 bg-saffron transition-[width] duration-300 group-hover:w-4"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="#" className="group flex items-center gap-2 text-saffron hover:text-saffron/80 font-medium transition-colors mt-2">
                    View All Projects <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-navy dark:text-white tracking-wider flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                VISIT US
              </h4>
              <address className="not-italic text-slate-600 dark:text-white/70 space-y-6">
                <div className="group">
                  <div className="flex items-center gap-2 font-semibold text-navy dark:text-white mb-2">
                    <MapPin className="w-4 h-4 text-saffron group-hover:animate-bounce transition-transform" /> 
                    Global HQ
                  </div>
                  <p className="pl-6 text-sm leading-relaxed">
                    124 Luxury Avenue,<br />
                    Design District, NY 10012
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-2 font-semibold text-navy dark:text-white mb-2">
                    <MapPin className="w-4 h-4 text-saffron group-hover:animate-bounce transition-transform" /> 
                    London Studio
                  </div>
                  <p className="pl-6 text-sm leading-relaxed">
                    45 Mayfair Square,<br />
                    London W1J 5QE
                  </p>
                </div>
              </address>
            </div>
            
          </div>
          
          {/* Right side graphic or summary (Replacing the India Map) */}
          <div className="w-full lg:w-[25%] flex flex-col items-start lg:items-center xl:items-end">
            <div className="w-full max-w-[220px]">
               <h4 className="font-bold text-lg mb-6 text-navy dark:text-white tracking-wider flex items-center gap-3 w-full text-left">
                <span className="w-2 h-2 rounded-full bg-saffron shadow-[0_0_10px_rgba(255,153,51,0.8)]"></span>
                OUR PRESENCE
              </h4>
              <div className="w-full transition-transform duration-500 p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center aspect-square shadow-inner relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-saffron/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <Globe className="w-24 h-24 text-saffron/40 group-hover:text-saffron/70 transition-colors duration-500" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar - Copyright and Social Links */}
        <div className="border-t border-black/10 dark:border-white/10 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Avyron Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Follow us on Instagram" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" aria-label="Follow us on Facebook" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" aria-label="Follow us on Twitter" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://wa.me/919110447020" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors">
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
