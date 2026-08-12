"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        console.error('Failed to submit form');
        // Handle error visually if needed
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden" id="contact">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Get in <span className="text-saffron italic">Touch</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Have a project in mind? Let's discuss how we can transform your space into a masterpiece.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm"
          >
            {isSuccess ? (
              <div className="text-center space-y-4 py-12 flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-foreground">Message Sent!</h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Thank you for reaching out. Our team has received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 px-8 py-3 rounded-xl bg-navy hover:bg-navy/90 text-white font-medium transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+91 91104 47020" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <textarea 
                      id="message"
                      name="message"
                      rows={4} 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-navy hover:bg-navy/90 text-white font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-saffron/10 text-saffron rounded-xl shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Call Us</h4>
                  <a href="tel:+919110447020" className="text-muted-foreground hover:text-saffron transition-colors">
                    +91 91104 47020
                  </a>
                </div>
              </div>
              
              <div className="bg-card border border-border p-6 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-saffron/10 text-saffron rounded-xl shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email Us</h4>
                  <a href="mailto:hello@avyron.com" className="text-muted-foreground hover:text-saffron transition-colors">
                    hello@avyron.com
                  </a>
                </div>
              </div>
              
              <div className="bg-card border border-border p-6 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-saffron/10 text-saffron rounded-xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Visit Studio</h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    A-367, Sector 46, Noida, UP, India, Pin-201301
                  </p>
                </div>
              </div>
              
              <div className="bg-card border border-border p-6 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">WhatsApp Us</h4>
                  <a href="https://wa.me/919110447020?text=Hello!%20I'm%20interested%20in%20Avyron%20Studio's%20services." target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#25D366] transition-colors">
                    Chat with an expert
                  </a>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-border shadow-sm flex-1">
              <iframe 
                src="https://maps.google.com/maps?q=Sector%2046%2C%20Noida&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
