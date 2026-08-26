"use client";

import { useConsultation } from "../consultation-provider";
import { ArrowRight, Phone } from "lucide-react";
import * as m from "motion/react-m";

export function FinalCTA() {
  const { openModal } = useConsultation();

  return (
    <section className="py-20 md:py-32 bg-navy relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
      
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Let's Design a Home You'll Love <span className="text-saffron italic">Coming Back To.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light">
            Book your free consultation today and take the first step toward your dream interior.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={openModal}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-saffron hover:bg-saffron/90 text-white font-semibold transition-[background-color,box-shadow,transform] duration-300 shadow-lg shadow-saffron/20 flex items-center justify-center gap-2 group text-lg"
            >
              Get Free Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a href="tel:+919110447020" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold transition-[background-color,border-color] duration-300 flex items-center justify-center gap-2 text-lg">
                <Phone className="w-5 h-5" />
                Call Now
              </button>
            </a>
          </div>
        </m.div>
      </div>
    </section>
  );
}
