"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, PenTool, TrendingUp, Clock, Headphones, Gem, FileText } from "lucide-react";

const reasons = [
  {
    title: "Customized Designs",
    desc: "Personalized layouts tailored to your unique taste and space.",
    icon: PenTool
  },
  {
    title: "Premium Quality",
    desc: "Best-in-class materials with long-lasting durability.",
    icon: Gem
  },
  {
    title: "Experienced Designers",
    desc: "A dedicated team of experts to guide you at every step.",
    icon: TrendingUp
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden costs. Detailed and transparent project estimates.",
    icon: FileText
  },
  {
    title: "End-to-End Execution",
    desc: "We handle everything from conceptualization to final handover.",
    icon: ShieldCheck
  },
  {
    title: "On-Time Delivery",
    desc: "Strict adherence to timelines with regular project updates.",
    icon: Clock
  },
  {
    title: "Dedicated Support",
    desc: "Post-installation support and extended warranties.",
    icon: Headphones
  },
  {
    title: "Free Consultation",
    desc: "Start with a complimentary design consultation and estimate.",
    icon: CheckCircle2
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
            <span className="text-sm font-semibold text-navy/80 dark:text-slate-300 tracking-wide uppercase">Why Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight leading-tight">
            Why Choose <span className="italic font-light text-saffron">Our Studio?</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            We deliver exceptional quality and seamless execution, ensuring your dream home becomes a reality without the stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-offwhite dark:bg-slate-800/50 rounded-2xl p-6 border border-black/5 dark:border-white/5 hover:border-saffron/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 text-navy dark:text-white group-hover:text-saffron group-hover:bg-saffron/10 transition-colors">
                <reason.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{reason.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
