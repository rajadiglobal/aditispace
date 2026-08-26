"use client";

import { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { X, CheckCircle2 } from "lucide-react";

type ConsultationContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openModal: () => void;
};

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export function useConsultation() {
  const context = useContext(ConsultationContext);
  if (!context) throw new Error("useConsultation must be used within ConsultationProvider");
  return context;
}

export function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Show popup after 3 seconds on first load
    const timer = setTimeout(() => {
      if (!hasShownPopup) {
        setOpen(true);
        setHasShownPopup(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasShownPopup]);

  useEffect(() => {
    // Show popup when navigating to a different page with a delay
    if (pathname !== prevPathRef.current) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 4500); // 4.5 second delay after navigation
      
      prevPathRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const openModal = () => setOpen(true);

  const contextValue = useMemo(() => ({ open, setOpen, openModal }), [open]);

  return (
    <ConsultationContext.Provider value={contextValue}>
      {children}
      <ConsultationModal open={open} onOpenChange={setOpen} />
    </ConsultationContext.Provider>
  );
}

function ConsultationModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] p-0 overflow-hidden bg-background border-none shadow-2xl">
        <div className="grid md:grid-cols-5 h-full">
          {/* Promotional Banner Side */}
          <div className="hidden md:flex flex-col justify-center items-center p-6 text-center text-white bg-[#111111] col-span-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/hero/luxury-kitchen.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[#111111]/70"></div>
            
            <div className="relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold tracking-wider uppercase rounded-full">
                Weekend Special
              </span>
              <h3 className="text-2xl font-heading font-bold text-white">Flat 25% OFF*</h3>
              <p className="text-sm font-medium text-white/90">on Modular Kitchens</p>
              <div className="w-12 h-px bg-accent mx-auto my-4"></div>
              <p className="text-xs text-white/80 leading-relaxed">
                Transform your home with beautifully designed interiors tailored to your lifestyle and budget.
              </p>
            </div>
          </div>
          
          {/* Form Side */}
          <div className="p-6 md:p-8 col-span-3 bg-card flex flex-col justify-center">
            {isSuccess ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground">Thank You!</h3>
                <p className="text-muted-foreground">
                  Your consultation request has been received. Our design experts will contact you shortly to confirm your appointment.
                </p>
                <Button 
                  onClick={() => {
                    onOpenChange(false);
                    setTimeout(() => setIsSuccess(false), 300);
                  }} 
                  className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                <DialogHeader className="mb-6 text-left">
                  <DialogTitle className="text-2xl font-heading font-bold text-foreground">Get a FREE Consultation & Estimate</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Leave your details below and we&apos;ll be in touch.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required placeholder="John Doe" className="bg-muted/50 border-muted focus-visible:ring-accent" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input id="mobile" type="tel" required placeholder="+91 91104 47020" className="bg-muted/50 border-muted focus-visible:ring-accent" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required placeholder="john@example.com" className="bg-muted/50 border-muted focus-visible:ring-accent" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City / Location</Label>
                      <Input id="city" required placeholder="Noida Sector 46" className="bg-muted/50 border-muted focus-visible:ring-accent" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input id="date" type="date" required className="bg-muted/50 border-muted focus-visible:ring-accent" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirement">What are you looking for?</Label>
                    <Select required>
                      <SelectTrigger className="bg-muted/50 border-muted focus-visible:ring-accent">
                        <SelectValue placeholder="Select requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modular-kitchen">Modular Kitchen</SelectItem>
                        <SelectItem value="complete-home">Complete Home Interiors</SelectItem>
                        <SelectItem value="living-room">Living Room</SelectItem>
                        <SelectItem value="bedroom">Bedroom</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-base mt-4" disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : "Book My Free Consultation"}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-4">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
