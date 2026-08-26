"use client";

import * as m from "motion/react-m";
import { AnimatePresence, animate, useInView, Variants } from "motion/react";
import { ArrowRight, Star, Shield, Trophy, Users, Ruler, Paintbrush, Compass, PenTool } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useConsultation } from "../consultation-provider";

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

function AnimatedCounter({ from, to, duration = 2, suffix = "" }: { from: number, to: number, duration?: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (!inView) return;
    
    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = Math.round(value) + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [from, to, duration, inView, suffix]);

  return <span ref={ref}>{from}{suffix}</span>;
}

const backgroundImages = [
  "/images/hero/elegant-living-room.jpg", // Elegant living room
  "/images/hero/luxury-kitchen.jpg", // Luxury kitchen
  "/images/hero/luxury-penthouse.jpg", // Luxury penthouse
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [mousePos, setMousePos] = useState({ absoluteX: 0, absoluteY: 0, relativeX: 0, relativeY: 0 });
  const { openModal } = useConsultation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { innerWidth, innerHeight } = window;
    
    setMousePos({
      absoluteX: x,
      absoluteY: y,
      relativeX: (e.clientX / innerWidth - 0.5) * 40,
      relativeY: (e.clientY / innerHeight - 0.5) * 40,
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Banner Area */}
      <div 
        className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        
        {/* Animated Background Images */}
        <AnimatePresence mode="wait">
          {backgroundImages.map((img, index) => (
            index === currentImage && (
              <m.div
                key={img}
                initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url('${img}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )
          ))}
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent dark:from-slate-900/95 dark:via-slate-900/70 z-0"></div>
        
        {/* Dynamic Cursor Glow */}
        <m.div 
          className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-saffron/20 rounded-full blur-[100px] z-10 mix-blend-screen hidden md:block"
          animate={{ 
            x: mousePos.absoluteX - 192, 
            y: mousePos.absoluteY - 192 
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
        />
        
        {/* Interactive Floating Elements - Moodboard Style on the Right */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 hidden lg:block">
          
          {/* Element 1: Space Planning / Blueprint */}
          <m.div 
            animate={{ x: mousePos.relativeX * -1.5, y: mousePos.relativeY * -1.5 }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute top-[15%] right-[25%] pointer-events-auto cursor-pointer"
          >
            <m.div 
              animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
              whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0px 10px 30px rgba(245,158,11,0.2)" }}
              transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 7, ease: "easeInOut" } }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 shadow-2xl relative overflow-hidden group"
            >
              <div className="bg-saffron/20 p-3 rounded-xl shadow-inner group-hover:bg-saffron/40 transition-colors">
                <Ruler className="text-saffron w-6 h-6" />
              </div>
              <div className="pr-2">
                <p className="text-white text-sm font-semibold tracking-wide">Floor Plan A</p>
                <div className="w-16 h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="w-3/4 h-full bg-saffron"></div>
                </div>
              </div>
            </m.div>
          </m.div>

          {/* Element 2: Material / Color Palette */}
          <m.div 
            animate={{ x: mousePos.relativeX * 1.5, y: mousePos.relativeY * 1.5 }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute top-[40%] right-[8%] pointer-events-auto cursor-pointer"
          >
            <m.div 
              animate={{ y: [0, 15, 0], rotate: [-2, 2, -2] }}
              whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0px 10px 30px rgba(96,165,250,0.2)" }}
              transition={{ y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }, rotate: { repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 } }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col gap-3 shadow-2xl relative overflow-hidden group min-w-[140px]"
            >
              <div className="flex items-center gap-2">
                <Paintbrush className="text-blue-400 w-4 h-4" />
                <p className="text-white text-xs font-bold uppercase tracking-wider">Materials</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="w-12 h-12 rounded-lg bg-[#2C3E50] shadow-inner group-hover:scale-105 transition-transform"></div>
                <div className="w-12 h-12 rounded-lg bg-[#D4AF37] shadow-inner group-hover:scale-105 transition-transform delay-75"></div>
                <div className="w-12 h-12 rounded-lg bg-[#F5F5DC] shadow-inner group-hover:scale-105 transition-transform delay-100"></div>
                <div className="w-12 h-12 rounded-lg bg-[#8B4513] shadow-inner group-hover:scale-105 transition-transform delay-150"></div>
              </div>
            </m.div>
          </m.div>

          {/* Element 3: Concept Sketch */}
          <m.div 
            animate={{ x: mousePos.relativeX * -2, y: mousePos.relativeY * -2 }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute bottom-[20%] right-[28%] pointer-events-auto cursor-pointer"
          >
            <m.div 
              animate={{ y: [0, -12, 0], rotate: [2, -1, 2] }}
              whileHover={{ scale: 1.05, rotate: 0, boxShadow: "0px 10px 30px rgba(167,139,250,0.2)" }}
              transition={{ y: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }, rotate: { repeat: Infinity, duration: 9, ease: "easeInOut", delay: 2 } }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl flex flex-col gap-2 group"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/40 transition-colors">
                  <PenTool className="text-purple-400 w-5 h-5" />
                </div>
                <p className="text-white text-xs font-bold uppercase tracking-wider">3D Render</p>
              </div>
              <div className="w-32 h-2 bg-white/10 rounded-full mt-1 overflow-hidden relative">
                <m.div 
                  className="absolute top-0 left-0 h-full w-full bg-purple-400 rounded-full origin-left" 
                  animate={{ scaleX: [0.2, 0.9, 0.2] }} 
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
                />
              </div>
              <p className="text-[10px] text-white/50 text-right mt-1">Rendering...</p>
            </m.div>
          </m.div>

          {/* Element 4: Direction / Compass */}
          <m.div 
            animate={{ x: mousePos.relativeX * 1.2, y: mousePos.relativeY * 1.2 }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute bottom-[10%] right-[8%] pointer-events-auto cursor-pointer"
          >
            <m.div 
              animate={{ y: [0, 10, 0] }}
              whileHover={{ scale: 1.1, boxShadow: "0px 0px 30px rgba(52,211,153,0.3)" }}
              transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 } }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full shadow-2xl group flex items-center justify-center"
            >
              <m.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
                 <Compass className="text-emerald-400 w-10 h-10 group-hover:text-emerald-300 transition-colors" />
              </m.div>
            </m.div>
          </m.div>
          
        </div>
        
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-10 pointer-events-auto">
          <m.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl space-y-6"
          >
            <m.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-saffron animate-pulse"></span>
              Award Winning Interior Studio
            </m.div>
            
            <m.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Beautiful Homes. <span className="text-saffron italic">Thoughtfully Designed.</span>
            </m.h1>
            
            <m.p variants={itemVariants} className="text-lg md:text-xl text-white/90 font-light max-w-2xl pt-4">
              Premium modular kitchens and complete home interiors designed around your lifestyle, taste and budget.
            </m.p>
            
            <m.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <m.button 
                onClick={openModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-saffron hover:bg-saffron/90 text-white font-semibold transition-colors shadow-lg shadow-saffron/20 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">Get Free Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
              </m.button>
              
              <a href="#services" className="w-full sm:w-auto">
                <m.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold transition-colors text-center group relative overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  <span className="relative z-10">Explore Our Designs</span>
                  <div className="absolute inset-0 h-full w-full bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                </m.button>
              </a>
            </m.div>
          </m.div>
        </div>
      </div>

      {/* Overlapping Stats Section */}
      <section className="relative z-30 -mt-12 md:-mt-20 pb-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <m.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="transition-[transform,opacity,box-shadow] duration-500 whitespace-nowrap bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl rounded-2xl p-6 md:p-8 border border-white/40 dark:border-white/10 shadow-2xl flex items-center"
          >
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-black/5 dark:divide-white/10">
              
              <div className="flex flex-col items-center justify-center space-y-1 text-center group px-4">
                <div className="p-2 bg-saffron/10 rounded-xl transition-[background-color,transform] duration-300 group-hover:bg-saffron/20 group-hover:scale-110 mb-2">
                  <Star className="w-5 h-5 text-saffron" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
                  Free Consultation
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase mt-1">Expert Advice</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-1 text-center group px-4">
                <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-[background-color,transform] duration-300 mb-2">
                  <Ruler className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
                  Free Estimate
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase mt-1">Transparent Pricing</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-1 text-center group px-4">
                <div className="p-2 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 group-hover:scale-110 transition-[background-color,transform] duration-300 mb-2">
                  <Paintbrush className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
                  Premium Designs
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase mt-1">Personalized For You</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-1 text-center group px-4">
                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 group-hover:scale-110 transition-[background-color,transform] duration-300 mb-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
                  Expert Execution
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase mt-1">On-Time Delivery</p>
              </div>

            </div>
          </m.div>
        </div>
      </section>
    </div>
  );
}
