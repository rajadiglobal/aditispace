"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, Building, Home, PaintBucket, Briefcase, CheckCircle2, User, MapPin } from "lucide-react";
import { RequirementPayload } from "@/services/formService";
import { toast } from "sonner";

export function ProjectPlanner() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [propertyType, setPropertyType] = useState<string>("");
  const [propertyStatus, setPropertyStatus] = useState<string>("");
  const [scope, setScope] = useState<string>("");
  const [propertySize, setPropertySize] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    notes: ""
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 6));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { formService } = await import('@/services/formService');
      const payload: RequirementPayload = {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        location_city: customerInfo.city,
        property_type: propertyType,
        property_status: propertyStatus,
        scope: scope,
        property_size: propertySize,
        budget_range: budgetRange,
        timeline: timeline,
        additional_notes: customerInfo.notes
      };
      
      await formService.submitRequirement(payload);
      setIsSuccess(true);
      setStep(6);
    } catch (error) {
      console.error('Error submitting planner:', error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return propertyType !== "";
      case 2: return propertyStatus !== "";
      case 3: return scope !== "" && propertySize !== "";
      case 4: return budgetRange !== "" && timeline !== "";
      case 5: return true; // Handled by form required attributes
      default: return true;
    }
  };

  return (
    <section id="project-planner" className="py-12 md:py-16 bg-offwhite dark:bg-[#050B14] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-saffron/10 rounded-l-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 rounded-r-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <m.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-saffron text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Start Your Journey
          </m.span>
          <m.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-heading text-4xl md:text-5xl font-bold text-navy dark:text-white mb-4"
          >
            Interactive Project Planner
          </m.h2>
          <m.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Let&apos;s design your dream space together. Answer a few quick questions so we can understand your vision and requirements.
          </m.p>
        </div>

        {/* Planner Card */}
        <m.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl rounded-[2rem] p-8 md:p-12 min-h-[500px] flex flex-col relative"
        >
          {/* Progress Indicator */}
          {step < 6 && (
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div 
                      className={`w-8 sm:w-10 h-1 rounded-full transition-colors duration-500 ${
                        i <= step ? "bg-saffron" : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />
                    {i < 5 && <div className="w-1 sm:w-2" />}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 shrink-0 ml-4">
                Step {step} of 5
              </span>
            </div>
          )}

          {/* Form Content Steps */}
          <div className="flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <m.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-2">What type of property are we designing?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">Select the main focus of your project.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "Apartment", icon: Home, desc: "Flats & Apartments" },
                      { id: "Villa", icon: Home, desc: "Independent Villas" },
                      { id: "Independent House", icon: Building, desc: "Standalone houses" },
                      { id: "Penthouse", icon: Home, desc: "Luxury penthouses" },
                      { id: "Office", icon: Briefcase, desc: "Commercial workspaces" },
                      { id: "Retail/Commercial", icon: Building, desc: "Shops & Boutiques" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => { setPropertyType(type.id); setTimeout(handleNext, 300); }}
                        className={`flex items-start gap-4 p-6 rounded-2xl border-2 text-left transition-[border-color,background-color] duration-300 ${propertyType === type.id ? "border-saffron bg-saffron/5" : "border-black/5 dark:border-white/5 hover:border-saffron/30"}`}
                      >
                        <div className={`p-3 rounded-full ${propertyType === type.id ? "bg-saffron text-white" : "bg-slate-100 dark:bg-slate-800 text-navy dark:text-white"}`}>
                          <type.icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg text-navy dark:text-white">{type.id}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{type.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </m.div>
              )}

              {step === 2 && (
                <m.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-2">What is the status of your property?</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">This helps us plan the right timeline for you.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Planning to buy",
                      "Recently purchased",
                      "Under construction",
                      "Ready to move",
                      "Renovation"
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setPropertyStatus(status); setTimeout(handleNext, 300); }}
                        className={`p-6 rounded-2xl border-2 text-center transition-[border-color,background-color] duration-300 ${propertyStatus === status ? "border-saffron bg-saffron/5 text-navy dark:text-white font-semibold" : "border-black/5 dark:border-white/5 hover:border-saffron/30 text-slate-600 dark:text-slate-300"}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </m.div>
              )}

              {step === 3 && (
                <m.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-2">Scope & Size</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">Tell us what needs to be designed and the approximate size.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base mb-3 block">What is the scope of the project?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Full Home Interior", "Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Commercial Interior", "Other"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setScope(s)}
                            className={`p-3 rounded-xl border-2 text-sm transition-[border-color,background-color] duration-300 ${scope === s ? "border-saffron bg-saffron/5 text-navy dark:text-white font-semibold" : "border-black/5 dark:border-white/5 hover:border-saffron/30 text-slate-600 dark:text-slate-300"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-base mb-3 block">Approximate property size?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Under 500 sq ft", "500–1000 sq ft", "1000–1500 sq ft", "1500–2500 sq ft", "2500–4000 sq ft", "4000+ sq ft"].map((size) => (
                          <button
                            key={size}
                            onClick={() => setPropertySize(size)}
                            className={`p-3 rounded-xl border-2 text-sm transition-[border-color,background-color] duration-300 ${propertySize === size ? "border-saffron bg-saffron/5 text-navy dark:text-white font-semibold" : "border-black/5 dark:border-white/5 hover:border-saffron/30 text-slate-600 dark:text-slate-300"}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </m.div>
              )}

              {step === 4 && (
                <m.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-2">Budget & Timeline</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">Help us tailor the design to your budget constraints.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base mb-3 block">Estimated Budget (INR)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Under ₹5 Lakhs", "₹5–10 Lakhs", "₹10–20 Lakhs", "₹20–40 Lakhs", "₹40–75 Lakhs", "₹75 Lakhs+", "Not Decided"].map((budget) => (
                          <button
                            key={budget}
                            onClick={() => setBudgetRange(budget)}
                            className={`p-3 rounded-xl border-2 text-sm transition-[border-color,background-color] duration-300 ${budgetRange === budget ? "border-saffron bg-saffron/5 text-navy dark:text-white font-semibold" : "border-black/5 dark:border-white/5 hover:border-saffron/30 text-slate-600 dark:text-slate-300"}`}
                          >
                            {budget}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base mb-3 block">When would you like to start?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Immediately", "Within 1 Month", "1–3 Months", "3–6 Months", "6+ Months", "Not Decided"].map((t) => (
                          <button
                            key={t}
                            onClick={() => setTimeline(t)}
                            className={`p-3 rounded-xl border-2 text-sm transition-[border-color,background-color] duration-300 ${timeline === t ? "border-saffron bg-saffron/5 text-navy dark:text-white font-semibold" : "border-black/5 dark:border-white/5 hover:border-saffron/30 text-slate-600 dark:text-slate-300"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </m.div>
              )}

              {step === 5 && (
                <m.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-2">Final Details</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">Leave your details so our design experts can prepare for your consultation.</p>
                  
                  <form id="plannerForm" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input required value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} placeholder="Rahul Sharma" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address *</Label>
                        <Input required type="email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} placeholder="rahul@example.com" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input required type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} placeholder="+91 98765 43210" />
                      </div>
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input required value={customerInfo.city} onChange={e => setCustomerInfo({...customerInfo, city: e.target.value})} placeholder="Mumbai" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Requirements (Optional)</Label>
                      <Textarea value={customerInfo.notes} onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})} placeholder="Any specific themes or requirements?" rows={3} />
                    </div>
                  </form>
                </m.div>
              )}

              {step === 6 && (
                <m.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-navy dark:text-white mb-4">Request Submitted!</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Thank you, {customerInfo.name}. We have received your detailed requirements. Our senior design consultant will contact you shortly.
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {step < 6 && (
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-black/10 dark:border-white/10">
              <Button 
                variant="ghost" 
                onClick={handlePrev}
                disabled={step === 1 || isSubmitting}
                className="text-slate-500 hover:text-navy dark:text-slate-400 dark:hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {step < 5 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-saffron text-white hover:bg-saffron/90 rounded-full px-8"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  form="plannerForm"
                  disabled={isSubmitting || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
                  className="bg-navy text-white hover:bg-navy/90 dark:bg-white dark:text-navy rounded-full px-8"
                >
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                  {!isSubmitting && <CheckCircle2 className="w-4 h-4 ml-2" />}
                </Button>
              )}
            </div>
          )}
        </m.div>
      </div>
    </section>
  );
}
