"use client";

import { motion } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Complete Home Interiors",
    content: "The entire process was smooth, from design consultation to final execution. The team understood exactly what we wanted and delivered a beautiful home.",
    rating: 5,
    image: "/images/testimonials/avatar1.jpg"
  },
  {
    name: "Michael Chen",
    role: "Modular Kitchen",
    content: "We are thrilled with our new modular kitchen. The quality of materials and the space optimization is simply brilliant. Highly recommended!",
    rating: 5,
    image: "/images/testimonials/avatar2.jpg"
  },
  {
    name: "Emma Thompson",
    role: "Living Room & Wardrobes",
    content: "Professional, on-time, and transparent. Their 3D designs gave us a clear picture, and the final execution was exactly as promised.",
    rating: 5,
    image: "/images/testimonials/avatar3.jpg"
  },
  {
    name: "David & Laura Smith",
    role: "Complete Home Interiors",
    content: "Working with them was an absolute pleasure. Their team understood our lifestyle and designed a space that is both breathtakingly beautiful and incredibly functional.",
    rating: 5,
    image: "/images/testimonials/avatar4.jpg"
  }
];

const faqs = [
  { question: "How much does a modular kitchen cost?", answer: "The cost of a modular kitchen depends on size, materials, finishes, and accessories. We offer options for various budgets. Contact us for a free personalized estimate." },
  { question: "Do you provide free consultation?", answer: "Yes, we offer a complimentary initial design consultation to understand your requirements, style preferences, and space dimensions." },
  { question: "How long does an interior project take?", answer: "A standard modular kitchen takes 4-6 weeks to execute. Complete home interiors typically take 8-12 weeks depending on the complexity and scope of the design." },
  { question: "Can I customize the design?", answer: "Yes! All our designs are 100% customizable. Our expert designers work closely with you to ensure the final output matches your exact vision and lifestyle." }
];

export function TestimonialsFAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <>
      <section className="py-12 md:py-16 bg-white dark:bg-slate-900 border-t border-black/5 dark:border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-navy dark:text-white">
              Client Experiences
            </h2>
          </div>
          
          <div className="relative flex overflow-hidden group w-full">
            {/* Gradient Mask for fading edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
            
            <motion.div 
              className="flex gap-6 md:gap-8 px-4 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            >
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="w-[320px] md:w-[450px] shrink-0 bg-slate-50 dark:bg-slate-800 p-8 md:p-10 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-1 mb-6 text-saffron">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-navy/90 dark:text-white/90 text-lg font-light italic mb-8 leading-relaxed line-clamp-4">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <Image src={testimonial.image} alt={testimonial.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-black/5 dark:border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Full Width Header, Aligned Compactly */}
          <div className="max-w-7xl mx-auto mb-10 flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-8 h-[1px] bg-saffron hidden md:block"></div>
              <span className="text-saffron text-xs font-medium tracking-[0.2em] uppercase">
                Information
              </span>
              <div className="w-8 h-[1px] bg-saffron hidden md:block"></div>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-heading text-3xl md:text-5xl font-light text-navy dark:text-white leading-tight"
            >
              Frequently <span className="italic text-slate-500 dark:text-slate-400">Asked Questions</span>
            </motion.h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto">
            
            {/* Left Column: Questions */}
            <div className="lg:w-5/12 lg:sticky lg:top-32 h-fit">
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                    onClick={() => setOpenFaqIndex(idx)}
                    className={`w-full group text-left px-6 py-5 rounded-xl transition-all duration-300 border flex items-center justify-between ${
                      openFaqIndex === idx 
                        ? 'bg-saffron text-white border-transparent' 
                        : 'bg-slate-50 dark:bg-slate-800/30 text-navy dark:text-white border-black/5 dark:border-white/5 hover:border-saffron'
                    }`}
                  >
                    <span className="font-heading text-lg truncate max-w-[90%]">{faq.question}</span>
                    <ChevronRight 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openFaqIndex === idx 
                          ? 'text-white rotate-90' 
                          : 'opacity-0 group-hover:opacity-100 text-saffron'
                      }`} 
                    />
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Right Column: Answer Display */}
            <div className="lg:w-7/12 flex items-start">
              {openFaqIndex !== null && (
                <motion.div
                  key={openFaqIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full relative min-h-[200px] flex items-center bg-slate-50 dark:bg-slate-800/30 border border-black/5 dark:border-white/5 rounded-2xl p-8 lg:p-12"
                >
                  <div className="w-full">
                    <h3 className="font-heading text-2xl text-navy dark:text-white mb-6">
                      {faqs[openFaqIndex].question}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed text-lg">
                      {faqs[openFaqIndex].answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
