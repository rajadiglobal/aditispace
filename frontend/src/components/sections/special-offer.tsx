"use client";

import * as m from "motion/react-m";
import { ArrowRight } from "lucide-react";
import { useConsultation } from "../consultation-provider";

export function SpecialOffer() {
  const { openModal } = useConsultation();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 bg-[url('/images/portfolio/kitchen-after.jpg')] bg-cover bg-center bg-fixed opacity-90"></div>
      <div className="absolute inset-0 bg-navy/80 dark:bg-slate-900/90 mix-blend-multiply"></div>
      
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 p-8 md:p-16 rounded-[2rem] text-center shadow-2xl flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron/20 border border-saffron/50 mb-6">
            <span className="text-xs md:text-sm font-bold text-saffron tracking-widest uppercase">Weekend Offer</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
            Your Dream Kitchen <span className="italic font-light">Starts Here.</span>
          </h2>
          
          <div className="bg-saffron text-white font-bold text-2xl md:text-4xl py-3 px-8 rounded-lg shadow-lg inline-block my-6 transform -rotate-2">
            Flat 25% OFF
          </div>
          
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Limited-time weekend offer on all Modular Kitchens. Get your free consultation and personalized estimate today.
          </p>
          
          <button 
            onClick={openModal}
            className="group relative px-8 py-4 bg-white text-navy hover:bg-saffron hover:text-white rounded-full font-bold transition-[background-color,color,box-shadow] duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,153,51,0.5)] flex items-center justify-center gap-3 overflow-hidden text-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              Claim My Offer
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <p className="text-[10px] text-white/50 mt-6 tracking-wide">*Terms & conditions apply.</p>
        </m.div>
      </div>
    </section>
  );
}
