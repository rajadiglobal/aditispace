"use client";

import { motion } from "framer-motion";

const brands = [
  { name: "Vogue" },
  { name: "Arch Digest" },
  { name: "Elle Decor" },
  { name: "Forbes" },
  { name: "Dwell" },
];

export function LogoTicker() {
  return (
    <section className="py-8 md:py-10 border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
          Featured In & Trusted By
        </p>
        <div className="relative flex overflow-hidden group max-w-7xl mx-auto">
          {/* Gradient Mask for fading edges */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-slate-50 dark:from-[#080d16] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-slate-50 dark:from-[#080d16] to-transparent z-10 pointer-events-none"></div>

          <motion.div 
            className="flex items-center gap-6 md:gap-10 px-6 md:px-12 w-max opacity-80 hover:opacity-100 transition-all duration-500"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[...brands, ...brands].map((brand, idx) => (
              <div 
                key={idx} 
                className="h-12 md:h-16 px-6 md:px-10 rounded-2xl bg-white dark:bg-slate-800/80 border border-black/10 dark:border-white/10 shrink-0 flex items-center justify-center transition-transform hover:scale-105 hover:shadow-md duration-300 shadow-sm"
              >
                <span className="font-heading font-bold text-base md:text-xl text-navy dark:text-slate-200 tracking-widest uppercase">
                  {brand.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
