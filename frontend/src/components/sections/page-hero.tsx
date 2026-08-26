"use client";

import Image from "next/image";
import * as m from "motion/react-m";
import { Variants } from "motion/react";
import { ChevronDown, MessageCircle } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  imagePath: string;
  whatsappAction?: {
    text: string;
    message: string;
  };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export function PageHero({ title, subtitle, description, imagePath, whatsappAction }: PageHeroProps) {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image with slow zoom animation */}
      <m.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, filter: "blur(10px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image 
          src={imagePath}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover"
        />
        {/* Premium Gradient Overlays */}
        <div className="absolute inset-0 bg-navy/70 dark:bg-slate-900/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-slate-950 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </m.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 pointer-events-none">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {subtitle && (
            <m.div variants={itemVariants} className="flex flex-col items-center mb-6">
              <span className="inline-block text-saffron text-sm md:text-base font-bold tracking-[0.2em] uppercase">
                {subtitle}
              </span>
              <div className="w-12 h-[2px] bg-saffron mt-3 opacity-80" />
            </m.div>
          )}
          
          <m.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.15] drop-shadow-lg">
            {title.split(' ').map((word, i, arr) => (
              <span key={`${word}-${i}`} className={i === arr.length - 1 ? "italic font-light text-saffron" : ""}>
                {word}{" "}
              </span>
            ))}
          </m.h1>
          
          <m.p variants={itemVariants} className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            {description}
          </m.p>

          {whatsappAction && (
            <m.div variants={itemVariants} className="mt-8 pointer-events-auto">
              <a
                href={`https://wa.me/919110447020?text=${encodeURIComponent(whatsappAction.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20b858] text-white font-medium transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                {whatsappAction.text}
              </a>
            </m.div>
          )}
        </m.div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <m.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
        <m.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="text-white/70 w-5 h-5" />
        </m.div>
      </m.div>
    </div>
  );
}
