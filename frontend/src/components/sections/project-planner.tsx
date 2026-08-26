"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Building, Home, PaintBucket, Briefcase, CheckCircle2 } from "lucide-react";

// Types
type ProjectType = "Residential" | "Commercial" | "Hospitality" | "Renovation" | null;

export function ProjectPlanner() {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<ProjectType>(null);

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <section id="project-planner" className="py-12 md:py-16 bg-offwhite dark:bg-[#050B14] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-saffron/10 rounded-l-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 rounded-r-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-saffron text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Start Your Journey
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-heading text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4"
          >
            Interactive Project Planner
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Let&apos;s design your dream space together. Answer a few quick questions so we can understand your vision and requirements.
          </motion.p>
        </div>

        {/* Planner Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl rounded-[2rem] p-8 md:p-12 min-h-[500px] flex flex-col relative"
        >
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={`w-10 h-1 rounded-full transition-colors duration-500 ${
                      i <= step ? "bg-saffron" : "bg-slate-200 dark:bg-slate-800"
                    }`}
                  />
                  {i < 4 && <div className="w-2" />}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Step {step} of 4
            </span>
          </div>

          {/* Form Content Steps */}
          <div className="flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-2">
                    What type of property are we designing?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">
                    Select the main focus of your project.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "Residential", icon: Home, desc: "Villas, Apartments, Penthouses" },
                      { id: "Commercial", icon: Building, desc: "Offices, Retail Spaces" },
                      { id: "Hospitality", icon: Briefcase, desc: "Hotels, Restaurants, Cafes" },
                      { id: "Renovation", icon: PaintBucket, desc: "Remodeling, Upgrades" },
                    ].map((type) => {
                      const Icon = type.icon;
                      const isSelected = projectType === type.id;
                      
                      return (
                        <button
                          key={type.id}
                          onClick={() => setProjectType(type.id as ProjectType)}
                          className={`flex items-start gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                            isSelected 
                              ? "border-saffron bg-saffron/5" 
                              : "border-black/5 dark:border-white/5 hover:border-saffron/30 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <div className={`p-3 rounded-full ${isSelected ? "bg-saffron text-white" : "bg-slate-100 dark:bg-slate-800 text-navy dark:text-white"}`}>
                            <Icon size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-navy dark:text-white">{type.id}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{type.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-2">
                    {projectType === "Residential" ? "What size is your home?" : 
                     projectType === "Commercial" ? "How large is your workspace?" : 
                     "What is the scale of the project?"}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">
                    This helps us estimate the timeline and resources.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {["Small (Under 1000 sqft)", "Medium (1000 - 3000 sqft)", "Large (Over 3000 sqft)"].map((size) => (
                      <button
                        key={size}
                        className="p-6 rounded-2xl border-2 border-black/5 dark:border-white/5 text-center hover:border-saffron hover:bg-saffron/5 transition-all duration-300"
                      >
                        <span className="font-medium text-navy dark:text-white">{size.split(" ")[0]}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 mt-2">{size.substring(size.indexOf("("))}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-2">
                    What budget range are you comfortable with?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">
                    We tailor our design solutions to respect your investment.
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    {["$20,000 - $50,000", "$50,000 - $150,000", "$150,000 - $500,000", "$500,000+"].map((budget) => (
                      <button
                        key={budget}
                        className="p-4 rounded-xl border border-black/10 dark:border-white/10 text-left hover:border-saffron hover:bg-saffron/5 transition-all duration-300"
                      >
                        <span className="font-medium text-navy dark:text-white text-lg">{budget}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-4">
                    Almost there!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    We have enough information to get started. Our senior design consultant will contact you shortly to discuss your vision in detail.
                  </p>
                  <Button size="lg" className="bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy dark:hover:bg-slate-200 px-8 py-6 text-lg rounded-full">
                    Submit Project Request
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-black/10 dark:border-white/10">
              <Button 
                variant="ghost" 
                onClick={handlePrev}
                disabled={step === 1}
                className="text-slate-500 hover:text-navy dark:text-slate-400 dark:hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={step === 1 && !projectType}
                className="bg-saffron text-white hover:bg-saffron/90 rounded-full px-8"
              >
                Next Step
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
