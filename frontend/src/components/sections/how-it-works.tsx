"use client";

import * as m from "motion/react-m";
import { MessageSquareText, Compass, Settings, Hammer } from "lucide-react";
import { useConsultation } from "../consultation-provider";

const steps = [
  {
    num: "01",
    title: "Consultation",
    desc: "Tell us about your home, requirements and preferences in a free design consultation.",
    icon: MessageSquareText
  },
  {
    num: "02",
    title: "Design",
    desc: "Our expert designers create a personalized interior concept and 3D visualization.",
    icon: Compass
  },
  {
    num: "03",
    title: "Finalize",
    desc: "Choose materials, finishes, and finalize the design along with a transparent estimate.",
    icon: Settings
  },
  {
    num: "04",
    title: "Execution",
    desc: "Our professional team executes the project with impeccable quality and attention to detail.",
    icon: Hammer
  }
];

export function HowItWorks() {
  const { openModal } = useConsultation();

  return (
    <section className="py-16 md:py-24 bg-offwhite dark:bg-slate-900/50 relative overflow-hidden border-t border-black/5 dark:border-white/5">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
              <span className="text-sm font-semibold text-navy/80 dark:text-slate-300 tracking-wide uppercase">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight leading-tight">
              How It <span className="italic font-light text-saffron">Works</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              A seamless, transparent and hassle-free 4-step journey to your dream home.
            </p>
          </div>
          
          <button 
            onClick={openModal}
            className="w-full md:w-auto inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 py-3 rounded-full bg-navy text-white hover:bg-saffron hover:text-white transition-colors duration-300 shadow-md hover:shadow-lg px-8"
          >
            Start Your Interior Journey
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent z-0"></div>

          {steps.map((step, index) => (
            <m.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-black/5 dark:border-white/5 flex items-center justify-center mb-6 relative group">
                <span className="absolute -top-2 -right-2 text-4xl font-bold text-saffron/20 group-hover:text-saffron/40 transition-colors font-heading">
                  {step.num}
                </span>
                <step.icon className="w-8 h-8 text-navy dark:text-white group-hover:text-saffron transition-colors relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-navy dark:text-white mb-3">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
